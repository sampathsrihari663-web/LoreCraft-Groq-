export type NodeStatus = 'locked' | 'cleared' | 'active' | 'studying';

export interface Answer {
  text: string;
  correct: boolean;
  dmg: number;
}

export interface Round {
  question: string;
  answers: Answer[];
}

export interface Lesson {
  eyebrow: string;
  title: string;
  subtitle: string;
  content: string; // HTML string for formatted content
}

export interface NodeData {
  id: number;
  name: string;
  territory: string;
  emoji: string;
  status: NodeStatus;
  xp: number;
  gold: number;
  desc: string;
  monster: string;
  monsterHp: number;
  question?: string;
  lessons?: Lesson[];
  x: number;
  y: number;
  isMystery?: boolean;
}
