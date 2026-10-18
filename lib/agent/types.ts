/**
 * C.A.N.D.I.D.A. Agent Core Types
 * Aligned with docs/ARCHITECTURE.md — Jarvis-class target
 */

export type RiskLevel = "low" | "medium" | "high";

export type LinkStatus = "online" | "degraded" | "offline";

export type MemoryTier = "working" | "episodic" | "semantic" | "procedural";

export interface LinkResult {
  success: boolean;
  data?: unknown;
  error?: string;
  meta?: Record<string, unknown>;
}

export interface OmniLink {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  status: LinkStatus;
  invoke(action: string, params: Record<string, unknown>): Promise<LinkResult>;
  healthCheck(): Promise<boolean>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
  linkId: string;
  risk: RiskLevel;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface ToolCallResult {
  toolCallId: string;
  name: string;
  result: LinkResult;
}

export type AgentPhase =
  | "idle"
  | "perceive"
  | "reason"
  | "plan"
  | "act"
  | "observe"
  | "remember"
  | "respond";

export interface AgentStep {
  phase: AgentPhase;
  timestamp: number;
  detail?: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolCallResult[];
}

export interface AgentRunContext {
  runId: string;
  trigger: "user" | "schedule" | "event" | "suggestion";
  input: string;
  steps: AgentStep[];
  maxToolRounds: number;
  currentRound: number;
}

export interface LLMMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_call_id?: string;
  tool_calls?: ToolCall[];
  name?: string;
}

export interface LLMChatOptions {
  messages: LLMMessage[];
  tools?: ToolDefinition[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface LLMChatResponse {
  content: string | null;
  toolCalls?: ToolCall[];
  finishReason: "stop" | "tool_calls" | "length" | "error";
  usage?: { promptTokens: number; completionTokens: number };
}

export interface LLMProvider {
  id: string;
  name: string;
  chat(options: LLMChatOptions): Promise<LLMChatResponse>;
  embed?(texts: string[]): Promise<number[][]>;
}

export interface MemoryRecord {
  id: string;
  content: string;
  tier: MemoryTier;
  metadata?: Record<string, unknown>;
  embedding?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface MemoryStore {
  encode(
    content: string,
    tier: MemoryTier,
    metadata?: Record<string, unknown>
  ): Promise<MemoryRecord>;
  retrieve(
    query: string,
    opts?: { tiers?: MemoryTier[]; k?: number }
  ): Promise<MemoryRecord[]>;
  update(id: string, patch: Partial<MemoryRecord>): Promise<MemoryRecord>;
  forget(id: string): Promise<void>;
}
