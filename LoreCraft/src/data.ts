import { javaNodes } from './data/java';
import { pythonNodes } from './data/python';
import { cNodes } from './data/c';
import { cppNodes } from './data/cpp';
import { csharpNodes } from './data/csharp';
import { NodeData } from "./types";

export const CAMPAIGNS: Record<string, NodeData[]> = {
  Java: javaNodes,
  Python: pythonNodes,
  C: cNodes,
  "C++": cppNodes,
  "C#": csharpNodes
};

// Start with Java by default
export const NODES = javaNodes;
