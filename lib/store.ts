import { create } from "zustand";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
};

export type MemoryTier = "working" | "episodic" | "semantic" | "procedural";

export type MemoryItem = {
  id: string;
  title: string;
  type: "project" | "knowledge" | "insight" | "routine";
  tier: MemoryTier;
  preview: string;
  updatedAt: string;
  strength?: number; // 0-100 relevance/activation
};

export type TaskItem = {
  id: string;
  title: string;
  status: "pending" | "running" | "completed" | "failed";
  priority: "low" | "medium" | "high";
};

export type Suggestion = {
  id: string;
  title: string;
  reason: string;
  action: string;
  urgency: "low" | "medium" | "high";
};

interface CandidaState {
  messages: ChatMessage[];
  memories: MemoryItem[];
  tasks: TaskItem[];
  suggestions: Suggestion[];
  activePanel: "chat" | "memory" | "tasks" | "workspace" | "proactive";
  systemStatus: "online" | "syncing" | "offline";
  isListening: boolean;
  agentActivity: string | null;
  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  setActivePanel: (panel: CandidaState["activePanel"]) => void;
  toggleTask: (id: string) => void;
  dismissSuggestion: (id: string) => void;
  setListening: (v: boolean) => void;
  setAgentActivity: (activity: string | null) => void;
}

const initialMemories: MemoryItem[] = [
  {
    id: "1",
    title: "C.A.N.D.I.D.A. Architecture",
    type: "project",
    tier: "semantic",
    preview: "Jarvis-class cognitive system. Agent loop, memory tiers, Omni-Link.",
    updatedAt: "Just now",
    strength: 98,
  },
  {
    id: "2",
    title: "Phase 1 Complete",
    type: "knowledge",
    tier: "episodic",
    preview: "Command Center layout, neural chat, memory & task panels shipped.",
    updatedAt: "Today",
    strength: 92,
  },
  {
    id: "3",
    title: "Cognitive Load Insight",
    type: "insight",
    tier: "semantic",
    preview: "High-density interfaces improve focus when visual noise is controlled.",
    updatedAt: "Yesterday",
    strength: 71,
  },
  {
    id: "4",
    title: "Morning System Check",
    type: "routine",
    tier: "procedural",
    preview: "Daily health + status sweep across connected services.",
    updatedAt: "Today 06:00",
    strength: 85,
  },
  {
    id: "5",
    title: "K.O.S.I. Local Inference",
    type: "knowledge",
    tier: "semantic",
    preview: "Preferred local LLM path via K.O.S.I. FastAPI + Ollama stack.",
    updatedAt: "2d ago",
    strength: 88,
  },
  {
    id: "6",
    title: "Working Context",
    type: "project",
    tier: "working",
    preview: "Active session: architecture formalized, cockpit deepening in progress.",
    updatedAt: "Now",
    strength: 100,
  },
];

const initialTasks: TaskItem[] = [
  { id: "t1", title: "Initialize Command Center UI", status: "completed", priority: "high" },
  { id: "t2", title: "Formalize Jarvis architecture", status: "completed", priority: "high" },
  { id: "t3", title: "Deepen cockpit (proactive + voice)", status: "running", priority: "high" },
  { id: "t4", title: "Connect LLM providers", status: "pending", priority: "high" },
  { id: "t5", title: "Tool-calling skeleton", status: "pending", priority: "medium" },
  { id: "t6", title: "Vector memory backend", status: "pending", priority: "medium" },
  { id: "t7", title: "Omni-Link: GitHub bridge", status: "pending", priority: "low" },
];

const initialSuggestions: Suggestion[] = [
  {
    id: "s1",
    title: "Wire K.O.S.I. as primary LLM",
    reason: "Semantic memory notes local inference preference. Phase 2 is next.",
    action: "Connect K.O.S.I. endpoint",
    urgency: "high",
  },
  {
    id: "s2",
    title: "Run morning system check",
    reason: "Procedural routine is due. Last run logged at 06:00.",
    action: "Execute routine",
    urgency: "medium",
  },
  {
    id: "s3",
    title: "Review architecture decisions",
    reason: "New ARCHITECTURE.md committed. Suggest encoding key principles into semantic memory.",
    action: "Encode principles",
    urgency: "low",
  },
];

export const useCandidaStore = create<CandidaState>((set) => ({
  messages: [
    {
      id: "sys-1",
      role: "system",
      content:
        "C.A.N.D.I.D.A. online. Cognitive systems nominal. Architecture locked to Jarvis-class target. Awaiting directive.",
      timestamp: new Date(),
    },
  ],
  memories: initialMemories,
  tasks: initialTasks,
  suggestions: initialSuggestions,
  activePanel: "chat",
  systemStatus: "online",
  isListening: false,
  agentActivity: null,
  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...msg,
          id: `msg-${Date.now()}`,
          timestamp: new Date(),
        },
      ],
    })),
  setActivePanel: (panel) => set({ activePanel: panel }),
  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status:
                t.status === "completed"
                  ? "pending"
                  : t.status === "pending"
                  ? "running"
                  : "completed",
            }
          : t
      ),
    })),
  dismissSuggestion: (id) =>
    set((state) => ({
      suggestions: state.suggestions.filter((s) => s.id !== id),
    })),
  setListening: (v) => set({ isListening: v }),
  setAgentActivity: (activity) => set({ agentActivity: activity }),
}));
