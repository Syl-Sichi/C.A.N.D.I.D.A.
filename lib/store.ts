import { create } from "zustand";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
};

export type MemoryItem = {
  id: string;
  title: string;
  type: "project" | "knowledge" | "insight" | "routine";
  preview: string;
  updatedAt: string;
};

export type TaskItem = {
  id: string;
  title: string;
  status: "pending" | "running" | "completed" | "failed";
  priority: "low" | "medium" | "high";
};

interface CandidaState {
  messages: ChatMessage[];
  memories: MemoryItem[];
  tasks: TaskItem[];
  activePanel: "chat" | "memory" | "tasks" | "workspace";
  systemStatus: "online" | "syncing" | "offline";
  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  setActivePanel: (panel: CandidaState["activePanel"]) => void;
  toggleTask: (id: string) => void;
}

const initialMemories: MemoryItem[] = [
  {
    id: "1",
    title: "C.A.N.D.I.D.A. Architecture",
    type: "project",
    preview: "Modular AI dashboard with neural chat, memory, and task engine.",
    updatedAt: "Just now",
  },
  {
    id: "2",
    title: "Phase 1 Roadmap",
    type: "knowledge",
    preview: "Command Center layout, mock panels, futuristic dark theme.",
    updatedAt: "2h ago",
  },
  {
    id: "3",
    title: "Cognitive Load Insight",
    type: "insight",
    preview: "High-density interfaces improve focus when visual noise is controlled.",
    updatedAt: "Yesterday",
  },
  {
    id: "4",
    title: "Morning System Check",
    type: "routine",
    preview: "Daily health + status sweep across connected services.",
    updatedAt: "Today 06:00",
  },
];

const initialTasks: TaskItem[] = [
  { id: "t1", title: "Initialize Command Center UI", status: "completed", priority: "high" },
  { id: "t2", title: "Wire Neural Chat mock responses", status: "running", priority: "high" },
  { id: "t3", title: "Connect LLM providers", status: "pending", priority: "medium" },
  { id: "t4", title: "Vector memory backend", status: "pending", priority: "medium" },
  { id: "t5", title: "Omni-Link: GitHub bridge", status: "pending", priority: "low" },
];

export const useCandidaStore = create<CandidaState>((set) => ({
  messages: [
    {
      id: "sys-1",
      role: "system",
      content: "C.A.N.D.I.D.A. online. Cognitive systems nominal. Awaiting directive.",
      timestamp: new Date(),
    },
  ],
  memories: initialMemories,
  tasks: initialTasks,
  activePanel: "chat",
  systemStatus: "online",
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
}));
