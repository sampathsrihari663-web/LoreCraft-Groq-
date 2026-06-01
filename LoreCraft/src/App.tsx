import React, { useState, useEffect, useMemo } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Hero } from './Hero';
import { CAMPAIGNS } from './data';
import { NodeData } from './types';
import { supabase } from './supabaseClient';

const ARTIFACT_DB: Record<string, { type: 'xp'|'gold'|'hp'|'dmg', value: number, desc: string, price: number, icon: string, longDesc: string }> = {
  'Crown of Recall': { type: 'xp', value: 0.02, desc: '+2% XP', price: 150, icon: '👑', longDesc: 'Forged by the last great Scholar-King. Unrivalled XP gains.' },
  'Staff of Mastery': { type: 'xp', value: 0.025, desc: '+2.5% XP', price: 200, icon: '🪄', longDesc: 'The legendary staff that multiplies every insight earned.' },
  'Lantern of Truth': { type: 'xp', value: 0.015, desc: '+1.5% XP', price: 100, icon: '🪔', longDesc: 'Its light reveals hidden knowledge in every battle.' },
  'Quill of Wisdom': { type: 'gold', value: 0.01, desc: '+1% GOLD', price: 50, icon: '🪶', longDesc: 'A humble quill that sharpens every answer into coin.' },
  'Merchant Ring': { type: 'gold', value: 0.02, desc: '+2% GOLD', price: 120, icon: '💍', longDesc: 'Worn by legendary traders who studied their craft.' },
  'Coin of Fortune': { type: 'gold', value: 0.03, desc: '+3% GOLD', price: 250, icon: '🌕', longDesc: 'The rarest coin in the realm — doubles your gold sense.' },
  'Amulet of Swiftness': { type: 'xp', value: 0.005, desc: '+0.5% XP', price: 40, icon: '🧿', longDesc: 'Focus crystallised into amber — grants sharper memory.' },
  'Tome of the Ancients': { type: 'xp', value: 0.03, desc: '+3% XP', price: 300, icon: '📕', longDesc: 'A dusty tome that amplifies every lesson absorbed.' },
  'Herb Pouch': { type: 'hp', value: 5, desc: '+5 MAX HP', price: 80, icon: '🌿', longDesc: 'Restorative herbs sewn by the tavern keeper.' },
  'Shield of Focus': { type: 'hp', value: 10, desc: '+10 MAX HP', price: 180, icon: '🛡', longDesc: 'Deflects distraction and rewards concentrated effort.' },
  'The Golden Compiler': { type: 'dmg', value: 0.05, desc: '+5% DMG', price: 400, icon: '⚡', longDesc: 'Executes your answers with ruthless efficiency.' },
  'Cached Memory': { type: 'xp', value: 0.08, desc: '+8% XP', price: 500, icon: '🧠', longDesc: 'Stores lessons permanently, boosting overall progression.' }
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'map' | 'tavern' | 'guild'>('home');
  const [activeView, setActiveView] = useState<'home' | 'map' | 'learn' | 'combat' | 'tavern' | 'guild'>('home');
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(0); // Default to Variables Village
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [learnPage, setLearnPage] = useState<number>(0);
  const [nodeProgress, setNodeProgress] = useState<Record<number, 'locked' | 'active' | 'cleared'>>(() => {
    const progress: Record<number, 'locked' | 'active' | 'cleared'> = {};
    Object.values(CAMPAIGNS).forEach(campaign => {
       campaign.forEach((n, idx) => progress[n.id] = (idx === 0 ? 'active' : 'locked'));
    });
    return progress;
  });
  const [levelUpNotify, setLevelUpNotify] = useState<{ show: boolean, level: number }>({ show: false, level: 1 });
  const [playerInfo, setPlayerInfo] = useState({
    name: 'Wandering Adventurer',
    campaignLanguage: 'Java',
    level: 1,
    xp: 0,
    totalXp: 0,
    maxXp: 500,
    hp: 100,
    maxHp: 100,
    gold: 0,
    artifacts: ['Quill of Wisdom'] as string[],
    equippedArtifacts: [] as string[],
    guild: null as string | null,
    quests: {
      citadelDefeats: 0,
      citadelClaimed: false,
      bugsSlain: 0,
      bugsClaimed: false
    },
    difficulty: 'Beginner',
    bestRank: '-',
    totalStudyTime: 0,
    dailyChallenge: {
       answered: false,
       streak: 0
    },
    usedQuestions: [] as string[]
  });

  const currentNodes = CAMPAIGNS[playerInfo.campaignLanguage] || CAMPAIGNS['Java'];

  const [tavernError, setTavernError] = useState<string | null>(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');
  
  const [isCreatingGuild, setIsCreatingGuild] = useState(false);
  const [newGuildName, setNewGuildName] = useState('');

  const [isFocusRaidActive, setIsFocusRaidActive] = useState(false);
  const [focusTimeLeft, setFocusTimeLeft] = useState(25 * 60);

  const [playerShake, setPlayerShake] = useState(false);
  const [enemyShake, setEnemyShake] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [guildsList, setGuildsList] = useState<any[]>([]);
  const [guildMembers, setGuildMembers] = useState<any[]>([]);
  const [guildMessages, setGuildMessages] = useState<any[]>([]);
  const [guildMessageInput, setGuildMessageInput] = useState('');
  const [scholarMessages, setScholarMessages] = useState<{role: 'user'|'assistant', content: string}[]>([
    {role: 'assistant', content: "Greetings! I am the Scholar Companion. Ask me anything about coding, algorithms, or your journey!"}
  ]);
  const [scholarInput, setScholarInput] = useState('');

  const fetchGuilds = async () => {
    const { data } = await supabase.from('guilds').select('*').order('total_xp', { ascending: false }).limit(10);
    if (data) setGuildsList(data);
  };
  
  const fetchGuildMembers = async (guildName: string) => {
    // Try multiple ways to find members in case JSONB querying has issues
    const { data, error } = await supabase.from('player_profiles').select('player_info');
    if (error) {
      console.error("Guild members fetch error", error);
    }
    if (data) {
      const members = data.map((d: any) => d.player_info).filter((pi: any) => pi && pi.guild === guildName);
      setGuildMembers(members);
    }
  };

  const fetchGuildMessages = async (guildName: string) => {
    const { data } = await supabase.from('guild_messages').select('*').eq('guild_name', guildName).order('created_at', { ascending: true });
    if (data) {
      setGuildMessages(data);
    }
  };

  useEffect(() => {
    if (activeTab === 'tavern' || activeTab === 'guild') {
      fetchGuilds();
      if (playerInfo.guild) {
        fetchGuildMembers(playerInfo.guild);
        fetchGuildMessages(playerInfo.guild);
      }
    }
  }, [activeTab, playerInfo.guild]);

  // Realtime subscription for guild messages + fallback polling
  useEffect(() => {
    if (!playerInfo.guild) return;
    const channel = supabase.channel('guild_messages_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guild_messages', filter: `guild_name=eq.${playerInfo.guild}` }, (payload) => {
        setGuildMessages(prev => {
          if (prev.find(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();
      
    // Fallback polling just in case Realtime isn't checked on the table, plus update members
    const pollTimer = setInterval(() => {
      fetchGuildMessages(playerInfo.guild!);
      fetchGuildMembers(playerInfo.guild!);
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollTimer);
    };
  }, [playerInfo.guild]);

  const loadProfile = async (userId: string, defaultName: string) => {
    try {
      const { data, error } = await supabase
        .from('player_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile not found - create new
        const newPlayerInfo = { 
          name: defaultName,
          campaignLanguage: 'Java',
          level: 1, xp: 0, totalXp: 0, maxXp: 500, hp: 100, maxHp: 100, gold: 0,
          artifacts: ['Quill of Wisdom'], equippedArtifacts: [], guild: null,
          quests: { citadelDefeats: 0, citadelClaimed: false, bugsSlain: 0, bugsClaimed: false },
          difficulty: 'Beginner', bestRank: '-', totalStudyTime: 0,
          dailyChallenge: { answered: false, streak: 0 }, usedQuestions: []
        };
        const initialProgress: Record<number, 'locked' | 'active' | 'cleared'> = {};
        Object.values(CAMPAIGNS).forEach(campaign => {
          campaign.forEach((n, idx) => initialProgress[n.id] = (idx === 0 ? 'active' : 'locked'));
        });

        const { data: newProfile, error: insertError } = await supabase
          .from('player_profiles')
          .insert({
            user_id: userId,
            player_info: newPlayerInfo,
            node_progress: initialProgress
          })
          .select()
          .single();
        
        if (!insertError && newProfile) {
          setPlayerInfo(newProfile.player_info);
          setNodeProgress(newProfile.node_progress);
        } else {
          setPlayerInfo(newPlayerInfo);
          setNodeProgress(initialProgress);
        }
      } else if (data) {
        // Existing profile loaded
        if (data.player_info) setPlayerInfo(data.player_info);
        if (data.node_progress) setNodeProgress(data.node_progress);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInitialLoadDone(true);
      setIsSessionLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        setCurrentUserId(session.user.id);
        loadProfile(session.user.id, session.user.user_metadata?.name || 'Wandering Adventurer');
      } else {
        setIsAuthenticated(false);
        setCurrentUserId(null);
        setIsSessionLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setCurrentUserId(session.user.id);
        if (!initialLoadDone) {
          loadProfile(session.user.id, session.user.user_metadata?.name || 'Wandering Adventurer');
        }
      } else {
        setIsAuthenticated(false);
        setCurrentUserId(null);
        setInitialLoadDone(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Debounced Supabase Save for State Updates
  useEffect(() => {
    if (!initialLoadDone || !isAuthenticated) return;
    const saveTimer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('player_profiles')
          .update({
            player_info: playerInfo,
            node_progress: nodeProgress,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', session.user.id);
      }
    }, 2000);
    return () => clearTimeout(saveTimer);
  }, [playerInfo, nodeProgress, initialLoadDone, isAuthenticated]);

  useEffect(() => {
    setNodeProgress(prev => {
      let changed = false;
      const next = { ...prev };
      currentNodes.forEach((n, i) => {
        if (!next[n.id]) {
          const isPrevCleared = i > 0 && next[currentNodes[i - 1].id] === 'cleared';
          next[n.id] = (i === 0 || isPrevCleared) ? 'active' : 'locked';
          changed = true;
        }
      });
      // also just in case we need to retroactively unlock
      currentNodes.forEach((n, i) => {
        if (i > 0 && next[currentNodes[i - 1].id] === 'cleared' && next[n.id] === 'locked') {
          next[n.id] = 'active';
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [currentNodes]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isFocusRaidActive && focusTimeLeft > 0) {
      interval = setInterval(() => {
        setFocusTimeLeft(prev => prev - 1);
        setPlayerInfo(prev => ({ ...prev, totalStudyTime: prev.totalStudyTime + 1 }));
      }, 1000);
    } else if (focusTimeLeft === 0) {
      setIsFocusRaidActive(false);
      // Optional: Add custom finished logic here
    }
    return () => clearInterval(interval);
  }, [isFocusRaidActive, focusTimeLeft]);

  const toggleFocusRaid = () => {
    setIsFocusRaidActive(prev => !prev);
    if (focusTimeLeft === 0) setFocusTimeLeft(25 * 60);
  };

  const toggleArtifact = (art: string) => {
    setTavernError(null);
    setPlayerInfo(prev => {
      const isEquipped = prev.equippedArtifacts.includes(art);
      if (isEquipped) {
        // Unequip
        const newEquipped = prev.equippedArtifacts.filter(a => a !== art);
        const hpBonus = (ARTIFACT_DB[art]?.type === 'hp') ? ARTIFACT_DB[art].value : 0;
        return { 
           ...prev, 
           equippedArtifacts: newEquipped, 
           maxHp: prev.maxHp - hpBonus, 
           hp: Math.min(prev.hp, prev.maxHp - hpBonus) 
        };
      } else {
        // Equip
        if (prev.equippedArtifacts.length >= 2) {
          setTavernError('Slots full! You must unequip from an active slot first.');
          return prev;
        }
        const newEquipped = [...prev.equippedArtifacts, art];
        const hpBonus = (ARTIFACT_DB[art]?.type === 'hp') ? ARTIFACT_DB[art].value : 0;
        return { 
           ...prev, 
           equippedArtifacts: newEquipped, 
           maxHp: prev.maxHp + hpBonus, 
           hp: prev.hp + hpBonus 
        };
      }
    });
  };

  const buyArtifact = (art: string) => {
    setTavernError(null);
    setPlayerInfo(prev => {
      const artData = ARTIFACT_DB[art];
      if (!artData) return prev;
      if (prev.artifacts.includes(art)) {
        setTavernError('You already own this artifact.');
        return prev;
      }
      if (prev.gold < artData.price) {
        setTavernError(`Not enough gold! You need ${artData.price} 🪙.`);
        return prev;
      }
      return {
        ...prev,
        gold: prev.gold - artData.price,
        artifacts: [...prev.artifacts, art]
      };
    });
  };

  const [bossState, setBossState] = useState<{
    active: boolean;
    round: number;
    bossHp: number;
    maxBossHp: number;
    playerHp: number;
    startTime: number;
    timeTakenOnCurrent: number;
    totalResponseTime: number;
    totalCorrect: number;
    totalWrong: number;
    totalDmgDealt: number;
    messages: { id: number, speaker: 'system' | 'boss' | 'player', text: string, dmgDealt?: number }[];
    status: 'idle' | 'playing' | 'victory' | 'defeat';
    finalRank?: string;
    xpEarned?: number;
    goldEarned?: number; /* Leaving for legacy maps */
    baseGold?: number;
    speedBonusGold?: number;
    hpBonusGold?: number;
    penaltyGold?: number;
    equipBonusGold?: number;
    totalGold?: number;
    droppedArtifact?: string;
    mysteryQuestion?: { question: string, answers: {text: string, correct: boolean}[], lesson?: string };
    isMysteryLoading?: boolean;
  }>({
    active: false,
    round: 0,
    bossHp: 100,
    maxBossHp: 100,
    playerHp: 100,
    startTime: 0,
    timeTakenOnCurrent: 0,
    totalResponseTime: 0,
    totalCorrect: 0,
    totalWrong: 0,
    totalDmgDealt: 0,
    messages: [],
    status: 'idle'
  });

  const selectedNode = currentNodes.find(n => n.id === selectedNodeId) || currentNodes[0];

  const shuffledAnswers = React.useMemo(() => {
    if (activeView === 'combat' && selectedNode && bossState.active) {
      if (bossState.mysteryQuestion) {
        return bossState.mysteryQuestion.answers;
      }
    }
    return [];
  }, [activeView, selectedNode, bossState.active, bossState.mysteryQuestion]);

  const handleTabClick = (tab: 'home' | 'map' | 'tavern' | 'guild') => {
    setActiveTab(tab);
    setActiveView(tab);
  };

  const startLearning = (nodeId: number) => {
    setSelectedNodeId(nodeId);
    setLearnPage(0);
    setActiveView('learn');
  };

  const enterCombat = async () => {
    if (!selectedNode.isMystery && (!selectedNode.lessons || selectedNode.lessons.length === 0)) return;
    const initialBossHp = selectedNode.isMystery ? 300 : 100;

    setBossState({
      active: true,
      round: 0,
      bossHp: initialBossHp,
      maxBossHp: initialBossHp,
      playerHp: playerInfo.hp,
      startTime: Date.now(),
      timeTakenOnCurrent: 0,
      totalResponseTime: 0,
      totalCorrect: 0,
      totalWrong: 0,
      totalDmgDealt: 0,
      status: 'playing',
      isMysteryLoading: selectedNode.isMystery,
      messages: [
        { id: 1, speaker: 'system', text: selectedNode.isMystery ? `THE ENDLESS VOID: You face the Omniscient Core.` : `CODING LESSON: ${selectedNode.desc}` },
        { id: 2, speaker: 'system', text: `The battle begins... ${selectedNode.monster} emerges with ${initialBossHp} HP!` }
      ]
    });
    setActiveView('combat');
    fetchNextDynamicQuestion();
  };

  const fetchNextDynamicQuestion = async () => {
    setBossState(prev => ({ ...prev, isMysteryLoading: true }));
    try {
      const selectedNode = currentNodes.find(n => n.id === selectedNodeId) || currentNodes[0];
      const curriculum = currentNodes.filter(n => !n.isMystery).map(n => n.name + ": " + n.desc).join('; ');
      
      const res = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: selectedNode.name + ' - ' + selectedNode.desc,
          language: playerInfo.campaignLanguage,
          isMystery: selectedNode.isMystery,
          allTopicsContent: curriculum,
          theoryContent: selectedNode.lessons?.map(l => l.content).join('\n'),
          usedQuestions: playerInfo.usedQuestions
        })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `Server HTTP ${res.status}`);
      }
      
      setPlayerInfo(prev => ({
        ...prev,
        usedQuestions: [...prev.usedQuestions, data.question]
      }));

      const options = data.options.map((opt: string) => ({ text: opt, correct: opt === data.correctOption })).sort(() => Math.random() - 0.5);
      
      setBossState(prev => ({
        ...prev,
        isMysteryLoading: false,
        startTime: Date.now(),
        mysteryQuestion: {
          question: data.question,
          answers: options,
          lesson: data.lesson
        },
        messages: [
           ...prev.messages,
           { id: Date.now() + Math.random(), speaker: 'boss', text: `Answer this: ${data.question}` }
        ]
      }));
    } catch (e: any) {
      console.error("Battle question fetch failed:", e);
      let errorMsg = e?.message || "Unknown error occurred.";
      setBossState(prev => ({
        ...prev,
        isMysteryLoading: false,
        messages: [
           ...prev.messages,
           { id: Date.now() + Math.random(), speaker: 'system', text: `Error fetching question: ${errorMsg}. Please check network and API configuration.` }
        ]
      }));
    }
  };

  const handleLevelUp = (currentXp: number, currentLevel: number): { newXp: number, newLevel: number, newMax: number } => {
    let nextLevel = currentLevel;
    let nextXp = currentXp;
    let nextMax = 500 * Math.pow(1.3, nextLevel - 1);
    
    while (nextXp >= nextMax) {
      nextXp -= nextMax;
      nextLevel += 1;
      nextMax = 500 * Math.pow(1.3, nextLevel - 1);
    }
    
    return { newXp: nextXp, newLevel: nextLevel, newMax: nextMax };
  };

  const handleClaimQuest = (questId: 'citadel' | 'bugs', xpReward: number) => {
    setPlayerInfo(prev => {
      if (questId === 'citadel' && prev.quests.citadelClaimed) return prev;
      if (questId === 'bugs' && prev.quests.bugsClaimed) return prev;
      
      const { newXp, newLevel, newMax } = handleLevelUp(prev.xp + xpReward, prev.level);
      
      if (newLevel > prev.level) {
        setLevelUpNotify({ show: true, level: newLevel });
        setTimeout(() => setLevelUpNotify(prev => ({ ...prev, show: false })), 4000);
      }
      
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        maxXp: newMax,
        totalXp: (prev.totalXp ?? 0) + xpReward,
        quests: {
          ...prev.quests,
          citadelClaimed: questId === 'citadel' ? true : prev.quests.citadelClaimed,
          bugsClaimed: questId === 'bugs' ? true : prev.quests.bugsClaimed
        }
      };
    });
  };

  const calculateRank = (correctRatio: number, avgTime: number) => {
    if (correctRatio === 1 && avgTime <= 5) return 'SS';
    if (correctRatio >= 0.8 && avgTime <= 10) return 'S';
    if (correctRatio >= 0.7 && avgTime <= 15) return 'A+';
    if (correctRatio >= 0.6) return 'A';
    if (correctRatio >= 0.5) return 'B+';
    return 'B-';
  };

  const handleAnswer = (answer: { text: string, correct: boolean, dmg?: number }) => {
    if (bossState.status !== 'playing') return;

    const timeTaken = (Date.now() - bossState.startTime) / 1000;
    
    let rawDmg = 0;
    let pDmg = 0;

    let dmgMultiplier = 1.0;
    playerInfo.equippedArtifacts.forEach(art => {
      if (ARTIFACT_DB[art]?.type === 'dmg') dmgMultiplier += ARTIFACT_DB[art].value;
    });

    if (answer.correct) {
      setEnemyShake(true);
      setTimeout(() => setEnemyShake(false), 500);

      // Simpler, fairer damage scaling
      if (timeTaken <= 5) {
        rawDmg = 50; // Fast response
      } else if (timeTaken <= 15) {
        rawDmg = 40; // Medium response
      } else {
        rawDmg = 30; // Slow response
      }
      
      // Apply dmg multiplier from artifacts
      rawDmg = Math.round(rawDmg * dmgMultiplier);
    } else {
      setPlayerShake(true);
      setTimeout(() => setPlayerShake(false), 500);
      
      pDmg = 34; // 3 lives essentially without artifacts
    }
    const finalDmg = rawDmg;

    const newBossHp = Math.max(0, bossState.bossHp - finalDmg);
    const newPlayerHp = Math.max(0, bossState.playerHp - pDmg);
    const newCorrect = bossState.totalCorrect + (answer.correct ? 1 : 0);
    const newWrong = bossState.totalWrong + (answer.correct ? 0 : 1);
    const newTotalDmg = bossState.totalDmgDealt + finalDmg;
    
    const newMessages = [
      ...bossState.messages,
      { id: Date.now() + Math.random(), speaker: 'player' as const, text: answer.text },
      { id: Date.now() + Math.random(), speaker: 'system' as const, text: answer.correct ? `Code Compiled! You dealt ${finalDmg} DMG. (${timeTaken.toFixed(1)}s)` : `CRITICAL EXCEPTION! You take ${pDmg} DMG.` },
      ...(bossState.mysteryQuestion?.lesson ? [{ id: Date.now() + Math.random(), speaker: 'boss' as const, text: `Listen closely: ${bossState.mysteryQuestion.lesson}` }] : [])
    ];

    const isDead = newBossHp === 0;
    const isPlayerDead = newPlayerHp === 0;

    if (isDead || isPlayerDead) {
       // Battle End
       let finalRank = 'B-';
       let xpEarned = 0;
       let baseGold = 0;
       let speedBonusGold = 0;
       let hpBonusGold = 0;
       let penaltyGold = 0;
       let equipBonusGold = 0;
       let totalGold = 0;
       let droppedArtifact: string | null = null;
       
       if (isDead) { // Victory
           const totalQuestions = newCorrect + newWrong;
           const correctRatio = newCorrect / Math.max(totalQuestions, 1);
           const avgTime = (bossState.totalResponseTime + timeTaken) / Math.max(totalQuestions, 1);
           finalRank = calculateRank(correctRatio, avgTime);
           
           // Boosts
           let multiplier = 1.0;
           if (finalRank === 'SS') multiplier = 2.0;
           if (finalRank === 'S') multiplier = 1.5;
           if (finalRank === 'A+') multiplier = 1.25;

           baseGold = 80;
           speedBonusGold = avgTime <= 5 ? 80 : (avgTime <= 15 ? 40 : 0);
           hpBonusGold = newPlayerHp === playerInfo.maxHp ? 50 : Math.floor(newPlayerHp * 0.25);
           penaltyGold = newWrong * -10;
           
           let rawTotalGold = baseGold + speedBonusGold + hpBonusGold + penaltyGold;
           if (rawTotalGold < 0) rawTotalGold = 0;

           // Equipment Gold Boost
           let goldEquipMultiplier = 0;
           playerInfo.equippedArtifacts.forEach(art => {
             if (ARTIFACT_DB[art]?.type === 'gold') goldEquipMultiplier += ARTIFACT_DB[art].value;
           });

           equipBonusGold = Math.floor(rawTotalGold * goldEquipMultiplier);
           totalGold = rawTotalGold + equipBonusGold;

           // Calculate buffs from currently equipped artifacts
           let artifactMultiplier = 1.0;
           playerInfo.equippedArtifacts.forEach(art => {
             if (ARTIFACT_DB[art]?.type === 'xp') artifactMultiplier += ARTIFACT_DB[art].value;
           });

           xpEarned = Math.round((selectedNode.xp || 100) * multiplier * artifactMultiplier);
           
           // Artifact drops from boss disabled
           
           // Apply level up
           const { newXp, newLevel, newMax } = handleLevelUp(playerInfo.xp + xpEarned, playerInfo.level);

           if (newLevel > playerInfo.level) {
             setLevelUpNotify({ show: true, level: newLevel });
             setTimeout(() => setLevelUpNotify(prev => ({ ...prev, show: false })), 4000);
           }

           setPlayerInfo(prev => {
             const RANKS: Record<string, number> = {'SS': 6, 'S': 5, 'A+': 4, 'A': 3, 'B': 2, 'B-': 1, '-': 0};
             const oldRankVal = RANKS[prev.bestRank || '-'] || 0;
             const newRankVal = RANKS[finalRank] || 0;
             return {
               ...prev,
               xp: newXp,
               totalXp: (prev.totalXp ?? 0) + xpEarned,
               level: newLevel,
               maxXp: newMax,
               gold: prev.gold + totalGold,
               hp: prev.maxHp, // Heal on victory
               artifacts: droppedArtifact ? [...prev.artifacts, droppedArtifact] : prev.artifacts,
               bestRank: newRankVal > oldRankVal ? finalRank : prev.bestRank,
               quests: {
                 ...prev.quests,
                 citadelDefeats: prev.quests.citadelDefeats + (selectedNode.id === 2 ? 1 : 0),
                 bugsSlain: prev.quests.bugsSlain + newCorrect
               }
             };
           });

           setNodeProgress(prev => {
             const newProgress = { ...prev };
             newProgress[selectedNode.id] = 'cleared';
             const currentIndex = currentNodes.findIndex(n => n.id === selectedNode.id);
             if (currentIndex >= 0 && currentIndex + 1 < currentNodes.length) {
               const nextNodeId = currentNodes[currentIndex + 1].id;
               if (newProgress[nextNodeId] === 'locked' || !newProgress[nextNodeId]) {
                 newProgress[nextNodeId] = 'active';
               }
             }
             return newProgress;
           });

           newMessages.push({ id: Date.now() + Math.random(), speaker: 'system', text: `Victory! ${selectedNode.monster} Has Fallen.` });
       } else {
           newMessages.push({ id: Date.now() + Math.random(), speaker: 'system', text: `GAME OVER! KILLED BY: ${selectedNode.monster}` });
           setPlayerInfo(prev => ({ 
             ...prev, 
             hp: prev.maxHp, // Heal on retreat/defeat
             quests: {
               ...prev.quests,
               bugsSlain: prev.quests.bugsSlain + newCorrect
             }
           }));
       }

       setBossState(prev => ({
         ...prev,
         bossHp: newBossHp,
         playerHp: newPlayerHp,
         totalCorrect: newCorrect,
         totalWrong: newWrong,
         totalDmgDealt: newTotalDmg,
         totalResponseTime: prev.totalResponseTime + timeTaken,
         status: isDead ? 'victory' : 'defeat',
         messages: newMessages,
         finalRank,
         xpEarned,
         baseGold, speedBonusGold, hpBonusGold, penaltyGold, equipBonusGold, totalGold,
         droppedArtifact: droppedArtifact || undefined
       }));
    } else {
       // Next round - loops continuously for all nodes until boss dies
       setBossState(prev => ({
         ...prev,
         round: prev.round + 1,
         bossHp: newBossHp,
         playerHp: newPlayerHp,
         totalResponseTime: prev.totalResponseTime + timeTaken,
         totalCorrect: newCorrect,
         totalWrong: newWrong,
         totalDmgDealt: newTotalDmg,
         messages: newMessages
       }));
       fetchNextDynamicQuestion();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isSessionLoading) {
    return <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg2)', color: 'var(--color-gold)' }}>Loading realm...</div>;
  }

  if (!isAuthenticated) return <Hero onAuth={(name) => {
    setPlayerInfo(prev => ({ ...prev, name }));
  }} />;

  return (
    <div className="app">
      {/* ── TOPBAR ── */}
      <header className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="logo"><div className="logo-rune">⚔</div>LoreCraft</div>
          {activeTab === 'map' && (
            <button className="topbar-mobile-btn" onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}>
              Syllabus
            </button>
          )}
        </div>
        <nav className="nav-tabs">
          <div className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`} onClick={() => handleTabClick('home')}>Home</div>
          <div className={`nav-tab ${activeTab === 'map' ? 'active' : ''}`} onClick={() => handleTabClick('map')}>Campaign Map</div>
          <div className={`nav-tab ${activeTab === 'tavern' ? 'active' : ''}`} onClick={() => handleTabClick('tavern')}>The Tavern</div>
          <div className={`nav-tab ${activeTab === 'guild' ? 'active' : ''}`} onClick={() => handleTabClick('guild')}>The GuildRoom</div>
        </nav>
        <div className="topbar-right">
          <div className="xp-bar-wrap">
            <span className="xp-label">LVL {playerInfo.level}</span>
            <div className="xp-track"><div className="xp-fill" style={{ width: `${(playerInfo.xp / playerInfo.maxXp) * 100}%` }}></div></div>
            <span className="xp-label" style={{ color: 'var(--color-gold)', fontSize: '9px' }}>{playerInfo.xp} / {Math.round(playerInfo.maxXp)} XP</span>
          </div>
          <div className="stat-chip">🪙 {playerInfo.gold}</div>
          <div className="stat-chip" style={{ color: '#E87A5A' }}>♥ {playerInfo.hp}</div>
          <button onClick={handleLogout} className="topbar-logout-btn">Logout</button>
        </div>
      </header>

      {/* ── OVERLAYS FOR MOBILE/TABLET ── */}
      {activeTab === 'map' && (
        <>
          <div className={`lp-overlay ${isLeftPanelOpen ? 'open' : ''}`} onClick={() => setIsLeftPanelOpen(false)}></div>
          <div className={`rp-overlay ${isRightPanelOpen ? 'open' : ''}`} onClick={() => setIsRightPanelOpen(false)}></div>
        </>
      )}

      {/* ── LEFT PANEL ── */}
      {activeTab === 'map' && (
      <aside className={`left-panel ${isLeftPanelOpen ? 'open' : ''}`}>
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Course Syllabus</span>
          <button 
            className="topbar-mobile-btn" 
            style={{ border: 'none', fontSize: '14px', background: 'transparent', padding: '0 4px', color: 'var(--color-slate)' }} 
            onClick={() => setIsLeftPanelOpen(false)}
          >
            ✕
          </button>
        </div>
        <div className="course-info">
          <div className="course-name">{playerInfo.campaignLanguage.toUpperCase()} — Core Concepts</div>
          <div className="course-sub">{currentNodes[0]?.territory || 'The Realm'}</div>
        </div>
        <div className="nodes-list">
          <div className="territory-label">{currentNodes[0]?.territory || 'The Realm'}</div>
          {currentNodes.map(node => {
            const currentStatus = nodeProgress[node.id] || node.status;
            return (
            <div 
              key={node.id} 
              className={`node-item ${currentStatus === 'locked' ? 'locked' : ''} ${selectedNodeId === node.id ? 'active' : ''}`}
              onClick={() => {
                if (currentStatus !== 'locked') {
                  setSelectedNodeId(node.id);
                  setActiveView('map');
                  setActiveTab('map');
                  setIsLeftPanelOpen(false);
                  setIsRightPanelOpen(true);
                }
              }}
            >
              <div className={`node-dot ${
                currentStatus === 'active' ? 'dot-active' :
                currentStatus === 'cleared' ? 'dot-cleared' :
                currentStatus === 'studying' ? 'dot-active' : 'dot-locked'
              }`}></div>
              <div className="node-text">
                <div className="node-name">{node.name}</div>
              </div>
              {currentStatus === 'cleared' && <div className="node-badge badge-done">Done</div>}
              {currentStatus === 'active' && <div className="node-badge badge-new">New</div>}
              {currentStatus === 'locked' && <div className="node-badge badge-lock">Lock</div>}
            </div>
            );
          })}
        </div>
      </aside>
      )}

      {/* ── MAIN PANEL ── */}
      <main className="main-panel">
        
        {/* HOME VIEW */}
        <div className={`view ${activeView === 'home' ? 'active' : ''}`} id="view-home" style={{ padding: '24px', overflowY: 'auto', background: 'var(--color-bg)', display: activeView === 'home' ? 'flex' : 'none', flexDirection: 'column', gap: '24px' }}>
           <div className="home-dashboard" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Top - Identity */}
              <div className="tavern-card" style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '24px' }}>
                 <div className="avatar-frame" style={{ width: '80px', height: '80px', fontSize: '40px' }}>🧙‍♂️</div>
                 <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                       <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                             {isEditingName ? (
                               <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                 <input 
                                   type="text" 
                                   value={editNameValue} 
                                   onChange={(e) => setEditNameValue(e.target.value)}
                                   style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-ink2)', padding: '4px 8px', borderRadius: '4px', outline: 'none' }}
                                   autoFocus
                                 />
                                 <button 
                                   className="edit-name-btn" 
                                   onClick={() => {
                                     if (editNameValue.trim()) {
                                       setPlayerInfo(prev => ({ ...prev, name: editNameValue }));
                                     }
                                     setIsEditingName(false);
                                   }}
                                 >
                                   Save
                                 </button>
                                 <button 
                                   className="edit-name-btn" 
                                   onClick={() => setIsEditingName(false)}
                                 >
                                   Cancel
                                 </button>
                               </div>
                             ) : (
                               <>
                                 <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-ink2)' }}>{playerInfo.name}</div>
                                 <button 
                                    className="edit-name-btn" 
                                    onClick={() => {
                                      setEditNameValue(playerInfo.name);
                                      setIsEditingName(true);
                                    }}
                                 >
                                   ✎ Edit
                                 </button>
                               </>
                             )}
                          </div>
                          <div style={{ color: 'var(--color-slate)', fontSize: '14px', marginBottom: '12px' }}>Level {playerInfo.level} Scholar</div>
                       </div>
                       <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '20px', color: 'var(--color-gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>LoreCraft</div>
                          <div style={{ fontSize: '12px', color: 'var(--color-slate)' }}>Mastery through Adventure</div>
                       </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <div className="xp-track" style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                         <div className="xp-fill" style={{ width: `${(playerInfo.xp / playerInfo.maxXp) * 100}%`, background: 'var(--color-gold)', height: '100%', borderRadius: '4px' }}></div>
                       </div>
                       <div style={{ fontSize: '12px', color: 'var(--color-gold)', fontFamily: 'var(--font-mono)' }}>{playerInfo.xp} / {playerInfo.maxXp} XP</div>
                    </div>
                 </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                 {/* Middle Left - Your Journey */}
                 <div className="tavern-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="tc-header">
                       <div className="tc-icon" style={{color: 'var(--color-blue)'}}>🗺️</div>
                       <div style={{ textAlign: 'left' }}>
                         <div className="tc-title">Your Journey</div>
                         <div className="tc-sub">Current Course: {playerInfo.campaignLanguage}</div>
                       </div>
                    </div>
                    
                    <div style={{ background: 'var(--color-bg4)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                       <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `conic-gradient(var(--color-gold) 0% ${(Object.values(nodeProgress).filter(v => v === 'cleared').length / currentNodes.length) * 100}%, var(--color-bg) ${(Object.values(nodeProgress).filter(v => v === 'cleared').length / currentNodes.length) * 100}% 100%)`, position: 'relative' }}>
                          <div style={{ position: 'absolute', inset: '4px', background: 'var(--color-bg4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', color: 'var(--color-gold)' }}>
                             {Object.values(nodeProgress).filter(v => v === 'cleared').length}/{currentNodes.length}
                          </div>
                       </div>
                       <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-ink2)', marginBottom: '4px' }}>Topics Cleared</div>
                          <div style={{ fontSize: '12px', color: 'var(--color-slate)' }}>Keep pushing forward!</div>
                       </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--color-slate)' }}>Difficulty:</span>
                          <select 
                             value={playerInfo.difficulty}
                             onChange={(e) => setPlayerInfo(p => ({...p, difficulty: e.target.value}))}
                             style={{ background: 'var(--color-bg3)', border: '1px solid var(--color-border)', color: 'var(--color-ink2)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                          >
                             <option value="Beginner">Beginner</option>
                             <option value="Intermediate">Intermediate</option>
                             <option value="Expert">Expert</option>
                          </select>
                       </div>
                       <button 
                          onClick={() => {
                             const lastNodeId = currentNodes.slice().reverse().find(n => nodeProgress[n.id] === 'active' || nodeProgress[n.id] === 'cleared')?.id || 0;
                             setSelectedNodeId(lastNodeId);
                             handleTabClick('map');
                          }}
                          className="action-btn" style={{ padding: '6px 16px', fontSize: '12px' }}>
                          Quick Resume ➡️
                       </button>
                    </div>
                 </div>

                 {/* Middle Right - Stats at a Glance */}
                 <div className="tavern-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="tc-header">
                       <div className="tc-icon" style={{color: 'var(--color-gold)'}}>📊</div>
                       <div style={{ textAlign: 'left' }}>
                         <div className="tc-title">Stats at a Glance</div>
                         <div className="tc-sub">Your career overview</div>
                       </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', flex: 1 }}>
                       <div className="pstat" style={{ background: 'var(--color-bg4)', padding: '12px', borderRadius: '6px' }}>
                          <div className="pstat-val">{playerInfo.totalXp.toLocaleString()}</div>
                          <div className="pstat-lbl">Total XP</div>
                       </div>
                       <div className="pstat" style={{ background: 'var(--color-bg4)', padding: '12px', borderRadius: '6px' }}>
                          <div className="pstat-val">{playerInfo.gold.toLocaleString()}</div>
                          <div className="pstat-lbl">Gold 🪙</div>
                       </div>
                       <div className="pstat" style={{ background: 'var(--color-bg4)', padding: '12px', borderRadius: '6px' }}>
                          <div className="pstat-val" style={{ color: 'var(--color-ember)' }}>{playerInfo.hp} / {playerInfo.maxHp}</div>
                          <div className="pstat-lbl">Current HP</div>
                       </div>
                       <div className="pstat" style={{ background: 'var(--color-bg4)', padding: '12px', borderRadius: '6px' }}>
                          <div className="pstat-val" style={{ color: 'var(--color-blue2)' }}>{playerInfo.bestRank}</div>
                          <div className="pstat-lbl">Best Rank</div>
                       </div>
                       <div className="pstat" style={{ background: 'var(--color-bg4)', padding: '12px', borderRadius: '6px' }}>
                          <div className="pstat-val" style={{ color: 'var(--color-jade)' }}>{Object.values(nodeProgress).filter(v => v === 'cleared').length}</div>
                          <div className="pstat-lbl">Topics Cleared</div>
                       </div>
                       <div className="pstat" style={{ background: 'var(--color-bg4)', padding: '12px', borderRadius: '6px', gridColumn: '1 / -1' }}>
                          <div className="pstat-val" style={{ color: 'var(--color-jade)' }}>{Math.floor(playerInfo.totalStudyTime / 3600)}h {Math.floor((playerInfo.totalStudyTime % 3600) / 60)}m</div>
                          <div className="pstat-lbl">Total Focus Study Time</div>
                       </div>
                    </div>
                 </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                 {/* Bottom Left - Guild Activity */}
                 <div className="tavern-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="tc-header">
                       <div className="tc-icon" style={{color: 'var(--color-jade)'}}>🛡️</div>
                       <div style={{ textAlign: 'left' }}>
                         <div className="tc-title">Guild Activity</div>
                         <div className="tc-sub">Live feed from {playerInfo.guild || 'Global'}</div>
                       </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'space-between' }}>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ fontSize: '13px', color: 'var(--color-slate)', fontStyle: 'italic', padding: '8px', textAlign: 'center' }}>
                             Connect a backend to populate members and live activity feed.
                          </div>
                       </div>

                       <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '4px' }}>
                          <div style={{ fontSize: '12px', color: 'var(--color-slate)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Guild Members</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', background: 'rgba(201,168,76,0.1)', padding: '2px 4px', borderRadius: '4px' }}>
                             <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>1. {playerInfo.name}</span>
                             <span style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>{playerInfo.totalXp} XP</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Bottom Right - Daily Challenge */}
                 <div className="tavern-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="tc-header">
                       <div className="tc-icon" style={{color: 'var(--color-ember)'}}>⚡</div>
                       <div style={{ textAlign: 'left' }}>
                         <div className="tc-title">Daily Challenge</div>
                         <div className="tc-sub">Featured question</div>
                       </div>
                    </div>

                    <div style={{ background: 'var(--color-bg4)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                       {playerInfo.dailyChallenge.answered ? (
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                             <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎓</div>
                             <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-jade)' }}>Challenge Completed!</div>
                             <div style={{ fontSize: '13px', color: 'var(--color-slate)', marginTop: '4px' }}>Come back tomorrow for a new question.</div>
                             <div style={{ marginTop: '16px', fontSize: '14px', color: 'var(--color-gold)', fontWeight: 'bold' }}>🔥 Streak: {playerInfo.dailyChallenge.streak} Days</div>
                          </div>
                       ) : (
                          <>
                             <div style={{ fontSize: '14px', color: 'var(--color-ink2)', lineHeight: '1.5' }}>
                                <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>Q: </span>
                                { `What is a variable in ${playerInfo.campaignLanguage}?`}
                             </div>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'flex-end' }}>
                                {[ "Variable", "Function", "Method"].filter(Boolean).map((ans, idx) => (
                                   <button 
                                      key={idx}
                                      onClick={() => {
                                         const isCorrect = idx === 0;
                                         setPlayerInfo(p => ({
                                            ...p, 
                                            gold: isCorrect ? p.gold + 50 : p.gold,
                                            dailyChallenge: { ...p.dailyChallenge, answered: true, streak: p.dailyChallenge.streak + (isCorrect ? 1 : 0) }
                                         }));
                                      }}
                                      className="nav-tab" style={{ textAlign: 'left', padding: '8px 12px', height: 'auto', display: 'block', width: '100%', cursor: 'pointer' }}>
                                      {ans}
                                   </button>
                                ))}
                             </div>
                          </>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* MAP VIEW */}
        <div className={`view ${activeView === 'map' ? 'active' : ''}`} id="view-map">
          <div className="map-canvas">
            <div className="map-bg"></div>
            <div className="map-grid"></div>
            <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0}}>
              {currentNodes.map((node, i) => {
                const nextNode = currentNodes[i + 1];
                if (!nextNode) return null;
                const currentStatus = nodeProgress[node.id] || node.status;
                const nextStatus = nodeProgress[nextNode.id] || nextNode.status;
                const isCleared = currentStatus === 'cleared' && nextStatus !== 'locked';
                return (
                  <line 
                    key={i} 
                    x1={`${node.x}%`} 
                    y1={`${node.y}%`} 
                    x2={`${nextNode.x}%`} 
                    y2={`${nextNode.y}%`} 
                    stroke={isCleared ? 'var(--color-gold3)' : 'var(--color-border2)'} 
                    strokeWidth="2" 
                    strokeDasharray={isCleared ? 'none' : '4 4'}
                    opacity="0.5"
                  />
                );
              })}
            </svg>
            <div className="map-title" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="map-title-text" style={{ margin: 0 }}>⚔ {currentNodes[0]?.territory || 'The Realm'}</div>
              <select 
                value={playerInfo.campaignLanguage}
                onChange={(e) => {
                  setPlayerInfo(p => ({...p, campaignLanguage: e.target.value}));
                  setSelectedNodeId(null);
                }}
                style={{ background: 'var(--color-bg3)', border: '1px solid var(--color-border)', color: 'var(--color-gold)', padding: '6px 12px', borderRadius: '4px', fontSize: '14px', cursor: 'pointer', outline: 'none' }}
              >
                {Object.keys(CAMPAIGNS).map(lang => (
                   <option key={lang} value={lang}>{lang} Campaign</option>
                ))}
              </select>
            </div>
            <div id="mapNodes" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
              {currentNodes.map(node => {
                const currentStatus = nodeProgress[node.id] || node.status;
                return (
                <div 
                  key={node.id} 
                  className={`map-node ${currentStatus}-node`} 
                  style={{ left: `${node.x}%`, top: `${node.y}%`, pointerEvents: currentStatus === 'locked' ? 'none' : 'auto' }}
                  onClick={() => {
                     if (currentStatus !== 'locked') {
                       setSelectedNodeId(node.id);
                       setIsRightPanelOpen(true);
                     }
                  }}
                >
                  <div className="mn-hex">{node.emoji}</div>
                  <div className="mn-name">{node.name}</div>
                </div>
                );
              })}
            </div>
            <div className="map-hint">Click a node to begin your studies</div>
          </div>
        </div>

        {/* LEARN VIEW */}
        <div className={`view ${activeView === 'learn' ? 'active' : ''}`} id="view-learn">
          <div className="learn-layout">
            <div className="learn-topbar">
              <div className="learn-breadcrumb">
                <div className="learn-back" onClick={() => setActiveView('map')}>← Map</div>
                <div>
                  <div className="learn-node-title">{selectedNode.name}</div>
                  <div className="learn-node-territory">{selectedNode.territory}</div>
                </div>
              </div>
              <div className="learn-progress-wrap">
                <span className="learn-prog-label">
                  {learnPage < selectedNode.lessons.length ? `Page ${learnPage + 1} of ${selectedNode.lessons.length + 1}` : 'Ready for Boss'}
                </span>
                <div className="learn-prog-track">
                  <div className="learn-prog-fill" style={{ width: `${Math.min(100, (learnPage / (selectedNode.lessons.length || 1)) * 100)}%` }}></div>
                </div>
              </div>
            </div>

            <div className="lesson-scroll">
              {learnPage < selectedNode.lessons.length ? (
                <div className="lesson-page active">
                  <div className="page-eyebrow">{selectedNode.lessons[learnPage].eyebrow}</div>
                  <div className="page-title">{selectedNode.lessons[learnPage].title}</div>
                  <div className="page-subtitle">{selectedNode.lessons[learnPage].subtitle}</div>
                  <div dangerouslySetInnerHTML={{ __html: selectedNode.lessons[learnPage].content }}></div>
                </div>
              ) : (
                <div className="dungeon-gate fade-in">
                  <div className="gate-rune-row">
                    <div className="gate-rune">⚔</div>
                    <div className="gate-rune">🛡</div>
                    <div className="gate-rune">📜</div>
                  </div>
                  <div className="gate-title">Ready for Battle?</div>
                  <div className="gate-sub">You have studied the scrolls. The dungeon awaits. Do you dare face the boss?</div>
                  <div className="gate-checklist">
                    <div className="gate-check-title">Requirements Complete</div>
                    <div className="gate-check-item">
                      <div className="gate-check-icon check-done">✓</div>
                      <div>Read all lesson scrolls</div>
                    </div>
                  </div>
                  <div className="gate-btns">
                    <button className="gate-btn-review" onClick={() => setLearnPage(0)}>📖 Review Again</button>
                    <button className="gate-btn-enter" onClick={enterCombat}>⚔ Enter the Dungeon</button>
                  </div>
                </div>
              )}
            </div>

            <div className="learn-footer">
              <button 
                className="learn-nav-btn btn-prev" 
                onClick={() => setLearnPage(Math.max(0, learnPage - 1))}
              >
                ← Previous
              </button>
              <div className="page-dots">
                {Array.from({ length: selectedNode.lessons.length + 1 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`page-dot ${i === learnPage ? 'active' : i < learnPage ? 'done' : ''}`}
                    onClick={() => setLearnPage(i)}
                  ></div>
                ))}
              </div>
              <button 
                className="learn-nav-btn btn-next" 
                onClick={() => setLearnPage(Math.min(selectedNode.lessons.length, learnPage + 1))}
                disabled={learnPage === selectedNode.lessons.length}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* COMBAT VIEW */}
        <div className={`view ${activeView === 'combat' ? 'active' : ''}`} id="view-combat">
          {bossState.active && (
            <div className="combat-layout">
              <div className="combat-top">
                <div className={`combatant-card enemy-card ${enemyShake ? 'shake' : ''}`}>
                  <div className="cb-name">{selectedNode.monster}</div>
                  <div className="cb-title">Boss · Node 0{selectedNode.id + 1}</div>
                  <div className="cb-hp-row">
                    <span className="cb-hp-label">HP</span>
                    <div className="cb-hp-track"><div className="cb-hp-fill fill-enemy" style={{width: `${(bossState.bossHp / bossState.maxBossHp) * 100}%`, transition: 'width 0.4s ease'}}></div></div>
                    <span className="cb-hp-val">{bossState.bossHp} / {bossState.maxBossHp}</span>
                  </div>
                </div>
                <div className="combat-vs">VS</div>
                <div className={`combatant-card player-card ${playerShake ? 'shake' : ''}`}>
                  <div className="cb-name">{playerInfo.name}</div>
                  <div className="cb-title">Level {playerInfo.level}</div>
                  <div className="cb-hp-row">
                    <span className="cb-hp-label">HP</span>
                    <div className="cb-hp-track"><div className="cb-hp-fill fill-player" style={{width: `${(bossState.playerHp / playerInfo.maxHp) * 100}%`}}></div></div>
                    <span className="cb-hp-val">{bossState.playerHp} / {playerInfo.maxHp}</span>
                  </div>
                </div>
              </div>
              
              <div className="chat-area">
                {bossState.messages.map((msg) => {
                  if (msg.speaker === 'system') {
                    return (
                      <div key={msg.id} className="chat-msg system-msg">
                        <div className="msg-bubble system-bubble">{msg.text}</div>
                      </div>
                    )
                  } else if (msg.speaker === 'boss') {
                    return (
                      <div key={msg.id} className="chat-msg">
                        <div className="msg-avatar avatar-enemy">🦇</div>
                        <div className="msg-bubble enemy-bubble">{msg.text}</div>
                      </div>
                    )
                  } else {
                    return (
                      <div key={msg.id} className="chat-msg msg-right">
                        <div className="msg-bubble player-bubble">{msg.text}</div>
                        <div className="msg-avatar avatar-player">🧙‍♂️</div>
                      </div>
                    )
                  }
                })}
              </div>
              
              {bossState.status === 'playing' ? (
                <>
                  <div className="combat-round-badge">
                    {`Round ${bossState.round + 1}`}
                  </div>
                  
                  <div className="combat-question-box">
                    <div className="cqb-label">
                      <span>Boss Challenge</span>
                      <span className="cqb-timer fast">⏱</span>
                    </div>
                    {bossState.isMysteryLoading ? (
                      <div className="cqb-text" style={{color: 'var(--color-gold)', fontStyle: 'italic', animation: 'pulsate 1.5s infinite'}}>The Core is computing your next trial...</div>
                    ) : (
                      <div className="cqb-text">
                        {bossState.mysteryQuestion?.question}
                      </div>
                    )}
                  </div>
                  
                  <div className="combat-bottom">
                    <div className="quick-answers">
                      {shuffledAnswers.map((ans, idx) => (
                        <button key={idx} className="qa-btn" onClick={() => handleAnswer(ans)} disabled={bossState.isMysteryLoading}>{ans.text}</button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="combat-bottom">
                  <button className="combat-send" style={{width: '100%', maxWidth: '300px', margin: '0 auto', display: 'block'}} onClick={() => setActiveView('map')}>Leave Dungeon</button>
                </div>
              )}
            </div>
          )}
        </div>

        {bossState.status === 'victory' && (
          <div className="popup-overlay">
             <div className="detailed-popup">
                <div className="dp-runes">
                  <div className="dp-rune">⚔</div>
                  <div className="dp-rune">⚔</div>
                  <div className="dp-rune active-rune">🏆</div>
                </div>
                
                <div className="dp-header-text">
                  <div className="dp-title">{selectedNode.monster?.toUpperCase() || 'BOSS'} DEFEATED!</div>
                  <div className="dp-subtitle">{selectedNode.name} — dungeon cleared</div>
                </div>

                <div className="dp-rank-box">
                  <div className="dp-rank-letter" style={{color: bossState.finalRank?.startsWith('S') ? 'var(--color-gold)' : (bossState.finalRank?.startsWith('A') ? '#4DB87A' : '#8A7F6A')}}>{bossState.finalRank}</div>
                  <div className="dp-rank-info">
                    <div className="dp-rank-label">Combat Rank</div>
                    <div className="dp-rank-desc">{
                      bossState.finalRank === 'SS' ? "Flawless Execution — Perfect Recall!" :
                      bossState.finalRank === 'S' ? "Lightning Scholar — Instant Recall!" :
                      bossState.finalRank?.startsWith('A') ? "Adept Coder — Strong Logic!" :
                      "Novice — Survived the Ordeal."
                    }</div>
                  </div>
                </div>

                <div className="dp-progress-row">
                  <span>Speed Bonus</span>
                  <span>{bossState.totalResponseTime / (bossState.totalCorrect + bossState.totalWrong) < 5 ? '100% Speed Bonus' : 'Standard Tempo'}</span>
                </div>
                <div className="dp-progress-track">
                  <div className="dp-progress-fill" style={{width: bossState.totalResponseTime / (bossState.totalCorrect + bossState.totalWrong) < 5 ? '100%' : '50%'}}></div>
                </div>

                <div className="dp-reward-list">
                  <div className="dp-reward-item">
                     <div className="dp-reward-left">
                       <div className="dp-reward-icon text-gray-400" style={{background: 'rgba(255,255,255,0.05)'}}>⚔</div>
                       <div className="dp-reward-text">
                         <div className="dp-reward-label">Base Reward</div>
                         <div className="dp-reward-sub">For clearing the dungeon</div>
                       </div>
                     </div>
                     <div className="dp-reward-val val-gold">+{bossState.baseGold} 🪙</div>
                  </div>
                  
                  {(bossState.speedBonusGold || 0) > 0 && (
                    <div className="dp-reward-item">
                       <div className="dp-reward-left">
                         <div className="dp-reward-icon text-yellow-500" style={{background: 'rgba(234, 179, 8, 0.1)'}}>⚡</div>
                         <div className="dp-reward-text">
                           <div className="dp-reward-label">Speed Bonus</div>
                           <div className="dp-reward-sub">Avg {(bossState.totalResponseTime / Math.max(1, bossState.totalCorrect + bossState.totalWrong)).toFixed(1)}s per answer</div>
                         </div>
                       </div>
                       <div className="dp-reward-val val-gold">+{bossState.speedBonusGold} 🪙</div>
                    </div>
                  )}

                  {(bossState.hpBonusGold || 0) > 0 && (
                    <div className="dp-reward-item">
                       <div className="dp-reward-left">
                         <div className="dp-reward-icon" style={{color: '#E87A5A', background: 'rgba(232, 122, 90, 0.1)'}}>♥</div>
                         <div className="dp-reward-text">
                           <div className="dp-reward-label">HP Bonus</div>
                           <div className="dp-reward-sub">Survived with {bossState.playerHp} HP</div>
                         </div>
                       </div>
                       <div className="dp-reward-val val-gold">+{bossState.hpBonusGold} 🪙</div>
                    </div>
                  )}

                  {(bossState.penaltyGold || 0) < 0 && (
                    <div className="dp-reward-item penalty">
                       <div className="dp-reward-left">
                         <div className="dp-reward-icon" style={{color: 'var(--color-ember)'}}>❌</div>
                         <div className="dp-reward-text">
                           <div className="dp-reward-label">Wrong Answer Penalty</div>
                           <div className="dp-reward-sub">{bossState.totalWrong} wrong answer(s)</div>
                         </div>
                       </div>
                       <div className="dp-reward-val">{bossState.penaltyGold} 🪙</div>
                    </div>
                  )}

                  <div className="dp-reward-item xp">
                     <div className="dp-reward-left">
                       <div className="dp-reward-icon" style={{color: 'var(--color-jade2)'}}>📚</div>
                       <div className="dp-reward-text">
                         <div className="dp-reward-label">XP Awarded</div>
                         <div className="dp-reward-sub">Combat knowledge XP</div>
                       </div>
                     </div>
                     <div className="dp-reward-val">+{bossState.xpEarned} XP</div>
                  </div>

                  {(bossState.equipBonusGold || 0) > 0 && (
                    <div className="dp-reward-item">
                       <div className="dp-reward-left">
                         <div className="dp-reward-icon text-yellow-300" style={{background: 'rgba(253, 224, 71, 0.1)'}}>⚖</div>
                         <div className="dp-reward-text">
                           <div className="dp-reward-label">Equipment Boost</div>
                           <div className="dp-reward-sub">Bonus from gear</div>
                         </div>
                       </div>
                       <div className="dp-reward-val val-gold">+{bossState.equipBonusGold} 🪙</div>
                    </div>
                  )}
                  
                  {bossState.droppedArtifact && (
                    <div className="dp-reward-item" style={{background: 'rgba(55,138,221,0.05)', borderColor: 'rgba(55,138,221,0.2)'}}>
                       <div className="dp-reward-left">
                         <div className="dp-reward-icon" style={{color: 'var(--color-blue)', background: 'rgba(55,138,221,0.1)'}}>💎</div>
                         <div className="dp-reward-text">
                           <div className="dp-reward-label" style={{color: 'var(--color-blue)'}}>ARTIFACT DROPPED</div>
                           <div className="dp-reward-sub">Rare loot acquired!</div>
                         </div>
                       </div>
                       <div className="dp-reward-val" style={{color: 'var(--color-blue2)', fontSize: '11px', flex: 1, textAlign: 'right'}}>{bossState.droppedArtifact}</div>
                    </div>
                  )}
                </div>

                <div className="dp-total-row">
                  <div className="dp-total-label">Total Gold Earned</div>
                  <div className="dp-total-val">+{bossState.totalGold} 🪙</div>
                </div>

                <button className="dp-button" onClick={() => { setBossState(b => ({...b, status: 'idle', active: false})); setActiveView('map'); }}>
                  Continue Your Journey →
                </button>
             </div>
          </div>
        )}

        {bossState.status === 'defeat' && (
          <div className="popup-overlay">
             <div className="detailed-popup" style={{border: '1px solid rgba(201,76,46,0.3)', background: 'linear-gradient(180deg, var(--color-bg2) 0%, #2a120e 100%)'}}>
                <div className="dp-runes">
                  <div className="dp-rune active-rune" style={{borderColor: 'var(--color-ember)', color: 'var(--color-ember)'}}>☠</div>
                </div>
                
                <div className="dp-header-text">
                  <div className="dp-title" style={{color: 'var(--color-ember)'}}>GAME OVER</div>
                  <div className="dp-subtitle">CRITICAL EXCEPTION: Compilation Failed!</div>
                </div>
                
                <div className="dp-rank-box" style={{background: 'rgba(201,76,46,0.1)', borderColor: 'rgba(201,76,46,0.2)'}}>
                  <div className="dp-rank-info">
                    <div className="dp-rank-label" style={{color: 'var(--color-ember)'}}>Killed By</div>
                    <div className="dp-rank-desc" style={{color: 'var(--color-ink2)', fontSize: '18px', fontWeight: 'bold'}}>{selectedNode.monster}</div>
                    <div className="dp-rank-sub" style={{color: 'var(--color-slate)', marginTop: '4px', fontSize: '12px'}}>Take a moment to study before trying again.</div>
                  </div>
                </div>

                <button className="dp-button" onClick={() => { setBossState(b => ({...b, status: 'idle', active: false})); setActiveView('map'); }} style={{borderColor: 'var(--color-ember)', color: 'var(--color-ember)'}}>
                  Retreat & Study →
                </button>
             </div>
          </div>
        )}

        {/* TAVERN VIEW */}
        <div className={`view ${activeView === 'tavern' ? 'active' : ''}`} id="view-tavern">
          <div className="tavern-inner">
            <div className="tavern-section-header">The Adventurer's Tavern</div>
            
            <div className="profile-card tavern-card" style={{ marginBottom: '16px' }}>
               <div className="avatar-frame">🧙‍♂️</div>
               <div style={{flex: 1}}>
                  <div className="profile-name-row">
                     {isEditingName ? (
                       <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                         <input 
                           type="text" 
                           value={editNameValue} 
                           onChange={(e) => setEditNameValue(e.target.value)}
                           style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-ink2)', padding: '4px 8px', borderRadius: '4px', outline: 'none' }}
                           autoFocus
                         />
                         <button 
                           className="edit-name-btn" 
                           onClick={() => {
                             if (editNameValue.trim()) {
                               setPlayerInfo(prev => ({ ...prev, name: editNameValue }));
                             }
                             setIsEditingName(false);
                           }}
                         >
                           Save
                         </button>
                         <button 
                           className="edit-name-btn" 
                           onClick={() => setIsEditingName(false)}
                         >
                           Cancel
                         </button>
                       </div>
                     ) : (
                       <>
                         <div className="profile-name-display">{playerInfo.name}</div>
                         <button 
                            className="edit-name-btn" 
                            onClick={() => {
                              setEditNameValue(playerInfo.name);
                              setIsEditingName(true);
                            }}
                         >
                           ✎ Edit
                         </button>
                       </>
                     )}
                  </div>
                  <div className="tc-sub" style={{marginBottom: '16px'}}>Level {playerInfo.level} · {playerInfo.guild || 'Solo Player'}</div>
                  <div className="profile-stats">
                     <div className="pstat">
                        <div className="pstat-val">{playerInfo.totalXp}</div>
                        <div className="pstat-lbl">Total XP</div>
                     </div>
                     <div className="pstat">
                        <div className="pstat-val">{playerInfo.gold}</div>
                        <div className="pstat-lbl">Gold</div>
                     </div>
                     <div className="pstat">
                        <div className="pstat-val">{playerInfo.artifacts.length}</div>
                        <div className="pstat-lbl">Artifacts</div>
                     </div>
                     <div className="pstat">
                        <div className="pstat-val" style={{color: 'var(--color-ember)'}}>{playerInfo.hp}</div>
                        <div className="pstat-lbl">HP</div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="tavern-grid flex flex-wrap gap-4" style={{ marginBottom: '16px' }}>
              <div className="tavern-card" style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column' }}>
                 <div className="tc-header" style={{ marginBottom: '16px' }}>
                   <div className="tc-icon" style={{color: 'var(--color-gold)'}}>⚡</div>
                   <div style={{ textAlign: 'left' }}>
                     <div className="tc-title">Active Equipment</div>
                     <div className="tc-sub">2 slots available</div>
                   </div>
                 </div>
                 <div className="shop-active-buffs" style={{ padding: 0, border: 'none', background: 'transparent' }}>
                    {playerInfo.equippedArtifacts.length === 0 ? (
                      <div className="tc-sub italic text-center py-4">No artifacts equipped.</div>
                    ) : (
                      playerInfo.equippedArtifacts.map((art, idx) => {
                         const def = ARTIFACT_DB[art];
                         return (
                           <div key={idx} className="buff-chip" style={{ marginRight: '8px', marginBottom: '8px' }}>
                              [{idx+1}] {art}: {def?.desc || 'Unknown Boost'}
                           </div>
                         );
                      })
                    )}
                 </div>
                 
                 <div className="tavern-artifact-selection mt-4" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--color-bg4)', border: '1px solid var(--color-border2)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div className="terminal-header" style={{ padding: '8px 12px', background: 'rgba(20,18,9,0.5)', borderBottom: '1px solid var(--color-border2)', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                       Artifact Vault
                    </div>
                    {tavernError && (
                      <div style={{ padding: '8px 12px', background: 'rgba(201,76,46,0.1)', color: 'var(--color-ember)', fontSize: '13px', borderBottom: '1px solid rgba(201,76,46,0.2)' }}>
                        {tavernError}
                      </div>
                    )}
                    <div style={{ flex: 1, padding: '12px', overflowY: 'auto', maxHeight: '180px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', alignContent: 'start' }}>
                       {playerInfo.artifacts.length === 0 ? (
                          <div className="tc-sub italic text-center py-4">Your vault is empty.</div>
                       ) : (
                          playerInfo.artifacts.map(art => {
                             const def = ARTIFACT_DB[art];
                             const isEquipped = playerInfo.equippedArtifacts.includes(art);
                             return (
                               <div 
                                 key={art} 
                                 onClick={() => toggleArtifact(art)}
                                 style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '10px 12px',
                                    background: isEquipped ? 'rgba(201,168,76,0.1)' : 'var(--color-bg3)',
                                    border: `1px solid ${isEquipped ? 'var(--color-gold)' : 'var(--color-border)'}`,
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                 }}
                               >
                                 <div>
                                    <div style={{ fontSize: '14px', color: isEquipped ? 'var(--color-gold)' : 'var(--color-ink)', fontWeight: isEquipped ? '600' : 'normal' }}>{art}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--color-slate)' }}>{def?.desc || 'Unknown Buff'}</div>
                                 </div>
                                 <div>
                                    {isEquipped ? (
                                       <div style={{ fontSize: '12px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Equipped</div>
                                    ) : (
                                       <div style={{ fontSize: '12px', color: 'var(--color-slate)' }}>Click to Equip</div>
                                    )}
                                 </div>
                               </div>
                             );
                          })
                       )}
                    </div>
                 </div>
              </div>

              <div className="tavern-card" style={{ flex: '1 1 300px', maxWidth: '100%' }}>
                 <div className="tc-header">
                   <div className="tc-icon" style={{color: 'var(--color-gold)'}}>🏆</div>
                   <div style={{ textAlign: 'left' }}>
                     <div className="tc-title">Guild Leaderboard</div>
                     <div className="tc-sub">{playerInfo.guild || 'Global'} · Live Rankings</div>
                   </div>
                 </div>
                 {(() => {
                   const leaderboardData = [
                     { name: `${playerInfo.name} (You)`, xp: playerInfo.totalXp, isMe: true }
                   ].sort((a, b) => b.xp - a.xp).slice(0, 5);
                   const maxLeaderboardXp = Math.max(...leaderboardData.map(l => l.xp), 1500);

                   return leaderboardData.map((lb, idx) => (
                     <div key={idx} className="leaderboard-row" style={lb.isMe ? { color: '#E8D5A3' } : undefined}>
                       <div className={`lb-rank ${idx === 0 ? 'top' : ''}`}>#{idx + 1}</div>
                       <div className={`lb-name ${lb.isMe ? 'font-bold' : ''}`}>{lb.name}</div>
                       <div className="lb-bar-wrap"><div className="lb-bar" style={{width: `${(lb.xp / maxLeaderboardXp) * 100}%`}}></div></div>
                       <div className="lb-xp">{lb.xp}</div>
                     </div>
                   ));
                 })()}
              </div>

              <div className="tavern-card" style={{ flex: '1 1 300px', maxWidth: '100%' }}>
                 <div className="tc-header" style={{ marginBottom: '16px' }}>
                   <div className="tc-icon" style={{color: 'var(--color-blue)'}}>⏱</div>
                   <div style={{ textAlign: 'left' }}>
                     <div className="tc-title">Focus Raid</div>
                     <div className="tc-sub">25-min study sprint</div>
                   </div>
                 </div>
                 <div className="pomodoro-display">
                    <div className="pomo-time">{`${Math.floor(focusTimeLeft / 60).toString().padStart(2, '0')}:${(focusTimeLeft % 60).toString().padStart(2, '0')}`}</div>
                    <div className="pomo-label">{focusTimeLeft === 0 ? "Focus Complete!" : isFocusRaidActive ? "Focusing..." : "Ready to begin"}</div>
                    <button className={`pomo-btn ${isFocusRaidActive ? 'pomo-stop' : 'pomo-start'}`} onClick={toggleFocusRaid}>
                       {isFocusRaidActive ? 'Pause Focus Raid' : focusTimeLeft === 0 ? 'Restart Focus Raid' : 'Begin Focus Raid'}
                    </button>
                 </div>
              </div>
            </div>

            <div className="tavern-card" style={{ marginBottom: '16px', borderTop: 'none', background: 'transparent', padding: '0' }}>
              <div className="tc-header" style={{ background: 'var(--color-bg3)', padding: '16px 20px', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '16px' }}>
                   <div className="tc-icon" style={{color: 'var(--color-ember)'}}>⚒</div>
                   <div style={{ textAlign: 'left' }}>
                     <div className="tc-title">The Blacksmith</div>
                     <div className="tc-sub">Equipment with real stat boosts · Gold: {playerInfo.gold} 🪙</div>
                   </div>
              </div>

              {tavernError && (
                <div style={{ padding: '8px 12px', marginBottom: '16px', background: 'rgba(201,76,46,0.1)', color: 'var(--color-ember)', fontSize: '13px', border: '1px solid rgba(201,76,46,0.2)', borderRadius: '6px' }}>
                  {tavernError}
                </div>
              )}

              <div className="shop-grid">
                 {Object.keys(ARTIFACT_DB).map(art => {
                   const def = ARTIFACT_DB[art];
                   const isOwned = playerInfo.artifacts.includes(art);
                   const isEquipped = playerInfo.equippedArtifacts.includes(art);
                   const canAfford = playerInfo.gold >= def.price;

                   // Dynamic styles depending on ownership
                   const bColor = isEquipped 
                     ? 'rgba(201,168,76,0.3)' 
                     : isOwned 
                       ? 'rgba(46,139,87,0.3)' 
                       : '';
                   const headerColor = isEquipped ? '#E8D5A3' : isOwned ? 'var(--color-jade2)' : '';

                   return (
                     <div key={art} className={`shop-item ${isOwned ? 'owned' : ''}`} style={bColor ? { borderColor: bColor } : {}}>
                       <div className="shop-item-top">
                         <div className="si-icon" style={isEquipped ? { fontSize: '1.875rem' } : {}}>{def.icon}</div>
                         <div className="si-info">
                           <div className="si-name" style={headerColor ? { color: headerColor } : {}}>{art}</div>
                           <div className="si-desc">{def.longDesc}</div>
                         </div>
                       </div>
                       <div className="si-footer" style={bColor ? { borderTopColor: isEquipped ? 'rgba(201,168,76,0.15)' : 'rgba(46,139,87,0.2)' } : {}}>
                         <span className={`si-bonus bonus-${def.type}`} style={isEquipped ? { color: 'var(--color-jade2)' } : {}}>{def.desc}</span>
                         {isEquipped ? (
                           <button 
                             onClick={() => toggleArtifact(art)}
                             className="si-owned-badge" 
                             style={{ color: 'var(--color-jade2)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}>
                             <span>✓</span> EQUIPPED
                           </button>
                         ) : isOwned ? (
                           <button 
                             onClick={() => toggleArtifact(art)}
                             style={{ padding: '4px 8px', fontSize: '11px', background: 'var(--color-bg2)', color: 'var(--color-slate)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                             EQUIP
                           </button>
                         ) : (
                           <button 
                             onClick={() => buyArtifact(art)}
                             style={{ 
                               padding: '4px 8px', fontSize: '11px', 
                               background: canAfford ? 'var(--color-gold)' : 'var(--color-bg2)', 
                               color: canAfford ? '#111' : 'var(--color-slate)', 
                               border: '1px solid ' + (canAfford ? 'var(--color-gold)' : 'var(--color-border)'), 
                               borderRadius: '4px', 
                               cursor: canAfford ? 'pointer' : 'not-allowed', 
                               fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' 
                             }}>
                             <span>🪙</span> {def.price}
                           </button>
                         )}
                       </div>
                     </div>
                   );
                 })}
              </div>
            </div>

            <div className="tavern-card" style={{ marginBottom: '64px' }}>
              <div className="tc-header" style={{ marginBottom: '16px' }}>
                   <div className="tc-icon" style={{color: 'var(--color-jade)'}}>📚</div>
                   <div style={{ textAlign: 'left' }}>
                     <div className="tc-title">The Scholar Companion</div>
                     <div className="tc-sub">Your AI Coding Mentor</div>
                   </div>
              </div>
              <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px', overflowY: 'auto', minHeight: '200px', maxHeight: '350px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px' }}
                   ref={(el) => { if (el) el.scrollTop = el.scrollHeight; }}>
                {scholarMessages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ background: msg.role === 'user' ? 'var(--color-jade)' : 'var(--color-bg2)', color: msg.role === 'user' ? '#111' : 'var(--color-ink2)', padding: '8px 12px', borderRadius: '6px', maxWidth: '85%', fontSize: '14px', lineHeight: '1.5', overflowX: 'auto' }}>
                      <div className="markdown-body">
                        <Markdown remarkPlugins={[remarkGfm]}>{msg.content}</Markdown>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!scholarInput.trim()) return;
                const newMsgs = [...scholarMessages, {role: 'user', content: scholarInput.trim() as string}];
                setScholarMessages(newMsgs as any);
                setScholarInput('');
                
                try {
                  const res = await fetch('/api/scholar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: scholarInput.trim() })
                  });
                  const data = await res.json();
                  if (data.error) {
                     setScholarMessages(prev => [...prev, {role: 'assistant', content: "Error: " + data.error}]);
                  } else {
                     setScholarMessages(prev => [...prev, {role: 'assistant', content: data.text}]);
                  }
                } catch (err: any) {
                  setScholarMessages(prev => [...prev, {role: 'assistant', content: "Network error calling the Scholar."}]);
                }
              }} style={{ display: 'flex', gap: '8px', marginTop: '12px', minHeight: '40px' }}>
                <input type="text" value={scholarInput} onChange={e => setScholarInput(e.target.value)} placeholder="Ask the Scholar a coding question..." style={{ flex: 1, padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '14px' }} />
                <button type="submit" style={{ padding: '0 24px', background: 'var(--color-gold)', color: '#111', fontWeight: 'bold', borderRadius: '6px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-cinzel)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ask</button>
              </form>
            </div>
          </div>
        </div>

        {/* GUILDROOM VIEW */}
        <div className={`view ${activeView === 'guild' ? 'active' : ''}`} id="view-guild">
          <div className="tavern-inner" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="tavern-section-header">The Guildhall</div>
            
            {!playerInfo.guild ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div className="tavern-card" style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>⛺</div>
                  <div className="tc-title" style={{ fontSize: '24px', color: 'var(--color-gold)', marginBottom: '8px' }}>You are a lone wolf.</div>
                  <div className="tc-sub" style={{ fontSize: '14px', marginBottom: '32px' }}>Join a guild to share knowledge, complete team bounties, and climb the server ranks.</div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                    <button 
                      onClick={() => setIsCreatingGuild(true)}
                      className="dp-button" style={{ maxWidth: '200px' }}>
                      Forge a New Guild
                    </button>
                  </div>
                  {isCreatingGuild && (
                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <input 
                        type="text" 
                        placeholder="Enter guild name..." 
                        value={newGuildName}
                        onChange={(e) => setNewGuildName(e.target.value)}
                        style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-ink2)', padding: '8px 12px', borderRadius: '4px', outline: 'none' }}
                        autoFocus
                      />
                      <button 
                         className="dp-button"
                         style={{ padding: '8px 16px', maxWidth: 'none', width: 'auto' }}
                         onClick={async () => {
                           const name = newGuildName.trim();
                           if (name) {
                             // Insert real guild to Supabase
                             const { error } = await supabase.from('guilds').insert([{ name }]);
                             if (!error) {
                               const newPlayerInfo = {...playerInfo, guild: name};
                               setPlayerInfo(newPlayerInfo);
                               if (currentUserId) {
                                 await supabase.from('player_profiles').update({ player_info: newPlayerInfo, updated_at: new Date().toISOString() }).eq('user_id', currentUserId);
                               }
                               setIsCreatingGuild(false);
                               setNewGuildName('');
                               fetchGuilds();
                               fetchGuildMembers(name);
                             } else {
                               // E.g. name taken
                               alert('Guild name might be taken!');
                             }
                           }
                         }}>
                         Confirm
                      </button>
                      <button 
                         className="dp-button"
                         style={{ padding: '8px 16px', maxWidth: 'none', width: 'auto', background: 'transparent', borderColor: 'var(--color-slate)', color: 'var(--color-slate)' }}
                         onClick={() => {
                           setIsCreatingGuild(false);
                           setNewGuildName('');
                         }}>
                         Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="tavern-card">
                  <div className="tc-header" style={{ marginBottom: '16px' }}>
                     <div className="tc-title">Top Guilds</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {guildsList.length === 0 ? (
                      <div style={{ color: 'var(--color-slate)', fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>
                        No active guilds yet. Be the first to forge one!
                      </div>
                    ) : (
                      guildsList.map((g, idx) => (
                        <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg)', padding: '12px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-ink2)' }}>{g.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--color-slate)' }}>Level {g.level} • {g.total_xp} XP</div>
                          </div>
                          <button 
                            onClick={async () => {
                              const newPlayerInfo = {...playerInfo, guild: g.name};
                              setPlayerInfo(newPlayerInfo);
                              if (currentUserId) {
                                await supabase.from('player_profiles').update({ player_info: newPlayerInfo, updated_at: new Date().toISOString() }).eq('user_id', currentUserId);
                              }
                              fetchGuildMembers(g.name);
                            }}
                            className="dp-button" style={{ width: 'auto', padding: '4px 12px', fontSize: '11px' }}>
                            Join
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {(() => {
                  const displayMembers = [...guildMembers];
                  if (playerInfo.guild && !displayMembers.find(m => m.name === playerInfo.name)) {
                     displayMembers.push({ name: playerInfo.name, totalXp: playerInfo.totalXp, level: playerInfo.level });
                  }
                  const finalMembers = displayMembers.length > 0 ? displayMembers : [{ name: playerInfo.name, totalXp: playerInfo.totalXp, level: playerInfo.level }];
                  const topMemberLevel = Math.max(...finalMembers.map(m => m.level || 1));
                  const totalGuildXp = finalMembers.reduce((sum, m) => sum + (m.totalXp || 0), 0);
                  
                  return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div className="tavern-card" style={{ marginBottom: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at center, rgba(201,168,76,0.1) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>🛡️</div>
                  <div className="tc-title" style={{ fontSize: '24px', color: 'var(--color-gold)', letterSpacing: '0.1em' }}>{playerInfo.guild}</div>
                  <div className="tc-sub" style={{ fontSize: '14px', marginBottom: '16px' }}>Active Guild</div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    <div className="pstat">
                       <div className="pstat-val">{finalMembers.length} / 50</div>
                       <div className="pstat-lbl">Members</div>
                    </div>
                    <div className="pstat">
                       <div className="pstat-val" style={{ color: 'var(--color-gold)' }}>{totalGuildXp}</div>
                       <div className="pstat-lbl">Total XP</div>
                    </div>
                    <div className="pstat">
                       <div className="pstat-val" style={{ color: 'var(--color-jade)' }}>Lvl {topMemberLevel}</div>
                       <div className="pstat-lbl">Guild Level</div>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                    <button 
                      onClick={() => {
                        setPlayerInfo(p => ({...p, guild: null}));
                        setGuildMembers([]);
                      }}
                      style={{ padding: '8px 16px', background: 'transparent', color: 'var(--color-ember)', border: '1px solid var(--color-ember)', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                      Leave Guild
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                  <div className="tavern-card">
                    <div className="tc-header" style={{ marginBottom: '24px' }}>
                      <div className="tc-icon" style={{color: 'var(--color-gold)'}}>👥</div>
                      <div style={{ textAlign: 'left' }}>
                        <div className="tc-title">Guild Members</div>
                        <div className="tc-sub">Active Roster</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {finalMembers.sort((a,b) => b.totalXp - a.totalXp).map((member, idx) => (
                        <div key={idx} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          flexWrap: 'wrap',
                          padding: '12px 16px', 
                          background: member.name === playerInfo.name ? 'rgba(201,168,76,0.08)' : 'var(--color-bg)', 
                          border: member.name === playerInfo.name ? '1px solid rgba(201,168,76,0.3)' : '1px solid var(--color-border)', 
                          borderRadius: '6px',
                          gap: '12px'
                        }}>
                          <div style={{ width: '30px', fontSize: '14px', fontFamily: 'var(--font-cinzel)', color: 'var(--color-gold3)', fontWeight: 'bold' }}>
                            #{idx + 1}
                          </div>
                          <div style={{ flex: '1 1 120px' }}>
                            <div style={{ fontSize: '14px', color: member.name === playerInfo.name ? 'var(--color-gold)' : 'var(--color-ink2)', fontWeight: 'bold' }}>
                              {member.name} {member.name === playerInfo.name ? '(You)' : ''}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--color-slate)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                              {idx === 0 ? 'Guildmaster' : 'Member'} • Level {member.level}
                            </div>
                          </div>
                          <div style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--color-gold)' }}>
                            {member.totalXp || 0} XP
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="tavern-card">
                      <div className="tc-header" style={{ marginBottom: '16px' }}>
                        <div className="tc-icon" style={{color: 'var(--color-ember)'}}>📜</div>
                        <div style={{ textAlign: 'left' }}>
                          <div className="tc-title">Guild Bounties</div>
                          <div className="tc-sub">One-Time Quests</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ background: 'var(--color-bg4)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-ink2)' }}>Defeat The Array Citadel</div>
                            <div style={{ fontSize: '12px', color: 'var(--color-gold)', fontFamily: 'var(--font-mono)' }}>+500 XP</div>
                          </div>
                          <div className="xp-track" style={{ height: '6px', background: 'var(--color-bg)', marginBottom: '8px' }}>
                            <div className="xp-fill" style={{ width: `${Math.min(100, (playerInfo.quests.citadelDefeats / 1) * 100)}%`, background: 'var(--color-gold)' }}></div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <div style={{ fontSize: '11px', color: 'var(--color-slate)' }}>{playerInfo.quests.citadelDefeats} / 1 Completion</div>
                             {playerInfo.quests.citadelDefeats >= 1 && !playerInfo.quests.citadelClaimed ? (
                               <button 
                                 onClick={() => handleClaimQuest('citadel', 500)}
                                 style={{ padding: '4px 8px', fontSize: '11px', background: 'var(--color-gold)', color: '#111', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Claim</button>
                             ) : playerInfo.quests.citadelClaimed ? (
                               <div style={{ fontSize: '11px', color: 'var(--color-jade)' }}>Completed</div>
                             ) : null}
                          </div>
                        </div>
                        
                        <div style={{ background: 'var(--color-bg4)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-ink2)' }}>Slay 100 Bugs (Quiz Corrects)</div>
                            <div style={{ fontSize: '12px', color: 'var(--color-gold)', fontFamily: 'var(--font-mono)' }}>+350 XP</div>
                          </div>
                          <div className="xp-track" style={{ height: '6px', background: 'var(--color-bg)', marginBottom: '8px' }}>
                            <div className="xp-fill" style={{ width: `${Math.min(100, (playerInfo.quests.bugsSlain / 100) * 100)}%`, background: 'var(--color-gold)' }}></div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <div style={{ fontSize: '11px', color: 'var(--color-slate)' }}>{playerInfo.quests.bugsSlain} / 100 Bugs</div>
                             {playerInfo.quests.bugsSlain >= 100 && !playerInfo.quests.bugsClaimed ? (
                               <button 
                                 onClick={() => handleClaimQuest('bugs', 350)}
                                 style={{ padding: '4px 8px', fontSize: '11px', background: 'var(--color-gold)', color: '#111', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Claim</button>
                             ) : playerInfo.quests.bugsClaimed ? (
                               <div style={{ fontSize: '11px', color: 'var(--color-jade)' }}>Completed</div>
                             ) : null}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="tavern-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div className="tc-header" style={{ marginBottom: '16px' }}>
                        <div className="tc-icon" style={{color: 'var(--color-blue)'}}>💬</div>
                        <div style={{ textAlign: 'left' }}>
                          <div className="tc-title">Guild Comm Link</div>
                          <div className="tc-sub">Live chatter</div>
                        </div>
                      </div>
                      <div style={{ flex: 1, background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px', overflowY: 'auto', minHeight: '150px', maxHeight: '250px', display: 'flex', flexDirection: 'column', gap: '8px' }}
                           ref={(el) => { if (el) el.scrollTop = el.scrollHeight; }}>
                        {guildMessages.length === 0 ? (
                          <div style={{ fontSize: '13px', color: 'var(--color-slate)', fontStyle: 'italic', textAlign: 'center', margin: 'auto' }}>
                            No messages yet. Be the first to start the conversation!
                          </div>
                        ) : (
                          guildMessages.map((msg, i) => (
                            <div key={i} style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', alignItems: msg.user_id === currentUserId ? 'flex-end' : 'flex-start' }}>
                               <div style={{ fontSize: '10px', color: 'var(--color-slate)', marginBottom: '2px' }}>{msg.user_name}</div>
                               <div style={{ background: msg.user_id === currentUserId ? 'var(--color-gold)' : 'var(--color-bg2)', color: msg.user_id === currentUserId ? '#111' : 'var(--color-ink2)', padding: '6px 10px', borderRadius: '6px', maxWidth: '90%', wordBreak: 'break-word' }}>
                                 {msg.content}
                               </div>
                            </div>
                          ))
                        )}
                      </div>
                      <form onSubmit={async (e) => { 
                        e.preventDefault(); 
                        const msgContent = guildMessageInput.trim();
                        if (!msgContent) return; 
                        
                        setGuildMessageInput(''); 
                        // Optimistically update UI
                        const tempMsg = { id: Date.now().toString(), guild_name: playerInfo.guild, user_id: currentUserId, user_name: playerInfo.name, content: msgContent, created_at: new Date().toISOString() };
                        setGuildMessages(prev => [...prev, tempMsg]);

                        const { error } = await supabase.from('guild_messages').insert([{ guild_name: playerInfo.guild, user_id: currentUserId, user_name: playerInfo.name, content: msgContent }]); 
                        if (error) {
                          console.error("Failed to send message", error);
                          alert("Failed to send message. Table might not exist or permissions error.");
                        }
                      }} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <input type="text" value={guildMessageInput} onChange={e => setGuildMessageInput(e.target.value)} placeholder="Send a message..." style={{ flex: 1, padding: '8px 12px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'var(--color-ink2)' }} />
                        <button type="submit" style={{ padding: '8px 16px', background: 'var(--color-gold)', color: '#111', fontWeight: 'bold', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Send</button>
                      </form>
                    </div>
                  </div>
                </div>
                </div>
                  );
                })()}
              </>
            )}
          </div>
        </div>

      </main>

      {/* ── RIGHT PANEL ── */}
      {activeTab === 'map' && (
      <aside className={`right-panel ${isRightPanelOpen ? 'open' : ''}`}>
        <div className="rp-section" style={{ position: 'relative' }}>
          <button 
            className="topbar-mobile-btn" 
            style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', fontSize: '14px', background: 'transparent' }} 
            onClick={() => setIsRightPanelOpen(false)}
          >
            ✕
          </button>
          <div className="rp-label">Selected Node</div>
          <div className="ani-name">{selectedNode.name}</div>
          <div className="ani-territory">{selectedNode.territory}</div>
          <div className="ani-desc">{selectedNode.desc}</div>
          <div className="reward-row">
            <div className="reward-chip xp-chip">+{selectedNode.xp} XP</div>
            <div className="reward-chip">+{selectedNode.gold} 🪙</div>
          </div>
          <div className={`rp-status status-${nodeProgress[selectedNode.id] || selectedNode.status}`}>
            {(nodeProgress[selectedNode.id] || selectedNode.status).toUpperCase()}
          </div>
          
          {(nodeProgress[selectedNode.id] || selectedNode.status) !== 'locked' && activeView === 'map' && (
            <button 
              style={{marginTop: '12px', width: '100%', padding: '10px'}} 
              className="name-save-btn"
              onClick={() => {
                 startLearning(selectedNode.id);
                 setIsRightPanelOpen(false);
              }}
            >
              Begin Study Session
            </button>
          )}
        </div>
        <div className="rp-section" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className="rp-label">Guild Activity</div>
          <div className="rp-activity">
            <div className="activity-item" style={{justifyContent: 'center', color: 'var(--color-slate)', fontStyle: 'italic'}}>
               Requires Backend Connection
            </div>
          </div>
        </div>
      </aside>
      )}

      {/* ── LEVEL UP NOTIFICATION ── */}
      {levelUpNotify.show && (
        <div 
          className="level-up-overlay" 
          onClick={() => setLevelUpNotify(prev => ({ ...prev, show: false }))}
          style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(21,21,21,0.85)',
          zIndex: 10000,
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div className="level-up-card" style={{
            background: 'var(--color-bg3)',
            border: '1px solid var(--color-gold)',
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center',
            boxShadow: '0 0 40px rgba(201,168,76,0.1), inset 0 0 20px rgba(201,168,76,0.05)',
            animation: 'scaleUpBounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'float 3s ease-in-out infinite' }}>🌟</div>
            <div style={{ fontFamily: 'var(--font-cinzel)', fontSize: '24px', letterSpacing: '0.2em', color: 'var(--color-gold3)', textTransform: 'uppercase', marginBottom: '8px' }}>Level Up!</div>
            <div style={{ fontSize: '16px', color: 'var(--color-slate)', marginBottom: '24px' }}>You have reached</div>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--color-gold)' }}>Level {levelUpNotify.level}</div>
            <div style={{ marginTop: '32px', fontSize: '12px', color: 'var(--color-slate2)' }}>Increased Max HP • Higher Skill Cap</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
