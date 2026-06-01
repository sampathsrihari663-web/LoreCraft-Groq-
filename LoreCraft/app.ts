import express from "express";
import Groq from "groq-sdk";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export const app = express();
app.use(express.json());

const apiRouter = express.Router();

apiRouter.post("/scholar", async (req, res) => {
    try {
      dotenv.config(); // Reload .env in case it was created/modified during runtime locally
      const { prompt } = req.body;
      const groqApiKey = process.env.GROQ_API_KEY;
      if (!groqApiKey) {
        return res.status(400).json({ error: "Groq API Key is not set. Please add it via Settings > Secrets." });
      }

      const groq = new Groq({ apiKey: groqApiKey });
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are the Scholar Companion, an AI mentor for coding. Explain things clearly and playfully like an RPG guide. Format your output using clean Markdown, keeping paragraphs concise and using code blocks appropriately."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
      });

      const text = response.choices[0]?.message?.content || "No response generated.";
      res.json({ text: text });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Failed to call Groq API" });
    }
  });

  // Dynamic Question API Route
  apiRouter.post("/generate-question", async (req, res) => {
    try {
      dotenv.config(); // Reload .env in case it was created/modified during runtime locally
      const { allTopicsContent, language, topic, isMystery, theoryContent, usedQuestions } = req.body;
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      
      let systemContent = `You are a boss in an RPG game asking a question about ${language || 'programming'}.`;
      if (isMystery) {
         systemContent += `\nAsk a multiple choice question from the following curriculum: ${allTopicsContent}. Make sure it is completely random, unique, and strictly testing these topics specifically inside the context of the ${language || 'programming'} language.`;
      } else {
         systemContent += `\nThe specific topic to test is: ${topic}. Make sure it asks a multiple choice question regarding this specific concept in ${language || 'programming'}.`;
         if (theoryContent) {
           systemContent += `\nBase your question strictly on the following theory taught to the player:\n"""\n${theoryContent}\n"""\nEnsure the question tests this exact knowledge.`;
         }
      }

      if (usedQuestions && usedQuestions.length > 0) {
        systemContent += `\nCRITICAL: DO NOT ASK ANY OF THE FOLLOWING PREVIOUSLY ASKED QUESTIONS (or conceptually identical variations):\n- ${usedQuestions.join('\n- ')}\nYou MUST generate a completely new question.`;
      }

      systemContent += `\nGenerate a JSON object representing a multiple choice question. It MUST be valid JSON.\n{\n  "question": "The question text, written as an arrogant boss taunting the player",\n  "options": ["Option A", "Option B", "Option C", "Option D"],\n  "correctOption": "The exact text of the correct option",\n  "lesson": "A 1-2 sentence explanation of the correct answer directly addressing the concept to teach the player"\n}`;

      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemContent
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        response_format: { type: "json_object" }
      });
      
      const text = response.choices[0]?.message?.content;
      if (!text) throw new Error("No response text");
      
      const data = JSON.parse(text);
      res.json(data);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Failed to generate question" });
    }
  });

  app.use("/api", apiRouter);
  app.use("/.netlify/functions/api", apiRouter);
