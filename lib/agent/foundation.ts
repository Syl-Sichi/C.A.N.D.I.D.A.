/** Shared capability and peer protocol primitives for C.A.N.D.I.D.A. */
export type PeerAgentId = "zelda" | "kosi" | "candida";
export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface SharedToolSpec {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  risk: RiskLevel;
  scopes: string[];
  idempotent: boolean;
  requiresConfirmation?: boolean;
  timeoutMs?: number;
}

export interface SharedToolInvocation {
  protocolVersion: "1.0";
  kind: "tool.invoke";
  requestId: string;
  agentId: PeerAgentId;
  tool: string;
  arguments: Record<string, unknown>;
  issuedAt: string;
  expiresAt: string;
  scopes: string[];
  idempotencyKey?: string;
  traceId?: string;
}

export interface SharedToolResult {
  protocolVersion: "1.0";
  kind: "tool.result";
  requestId: string;
  ok: boolean;
  data?: unknown;
  error?: { code: string; message: string; retryable?: boolean };
  completedAt: string;
  durationMs?: number;
}

export interface DelegationGrant {
  protocolVersion: "1.0";
  kind: "agent.delegate";
  delegationId: string;
  parentDelegationId?: string;
  fromAgent: PeerAgentId;
  toAgent: PeerAgentId;
  objective: string;
  context?: Record<string, unknown>;
  scope: { tools: string[]; data: string[]; scopes?: string[] };
  issuedAt: string;
  expiresAt: string;
  depth: number;
  budget?: { maxToolCalls?: number; maxDurationMs?: number };
}

export interface DeviceHello {
  protocolVersion: "1.0";
  kind: "device.hello";
  deviceId: string;
  deviceType: "android" | "macos" | "linux" | "windows" | "iot";
  publicKey: string;
  nonce: string;
  capabilities: string[];
  appVersion?: string;
}

export interface DeviceCommand {
  protocolVersion: "1.0";
  kind: "device.command";
  requestId: string;
  deviceId: string;
  command: string;
  arguments: Record<string, unknown>;
  scopes: string[];
  expiresAt: string;
  requiresConfirmation?: boolean;
  idempotencyKey?: string;
}

export interface RegisteredTool {
  spec: SharedToolSpec;
  execute(args: Record<string, unknown>): Promise<unknown>;
}

export class SharedCapabilityRuntime {
  private readonly tools = new Map<string, RegisteredTool>();

  register(tool: RegisteredTool): void {
    const { spec } = tool;
    if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9_-]*)+$/.test(spec.name)) {
      throw new Error("Tool name must be namespaced");
    }
    if (this.tools.has(spec.name)) throw new Error("Tool already registered");
    if (spec.inputSchema.type !== "object") throw new Error("Tool input schema must be an object");
    this.tools.set(spec.name, tool);
  }

  manifest(agentId: PeerAgentId) {
    return {
      protocolVersion: "1.0" as const,
      agentId,
      tools: [...this.tools.values()].map(({ spec }) => ({ ...spec })),
    };
  }

  async invoke(
    name: string,
    args: Record<string, unknown>,
    grantedScopes: string[],
    confirmed = false,
    requestId = crypto.randomUUID(),
  ): Promise<SharedToolResult> {
    const tool = this.tools.get(name);
    const completedAt = new Date().toISOString();
    if (!tool) return { protocolVersion: "1.0", kind: "tool.result", requestId, ok: false, error: { code: "tool_not_found", message: name }, completedAt };
    if (!tool.spec.scopes.every((scope) => grantedScopes.includes(scope))) {
      return { protocolVersion: "1.0", kind: "tool.result", requestId, ok: false, error: { code: "scope_denied", message: "Required scopes not granted" }, completedAt };
    }
    if ((tool.spec.requiresConfirmation || ["high", "critical"].includes(tool.spec.risk)) && !confirmed) {
      return { protocolVersion: "1.0", kind: "tool.result", requestId, ok: false, error: { code: "confirmation_required", message: "Explicit confirmation required" }, completedAt };
    }
    try {
      const data = await tool.execute(args);
      return { protocolVersion: "1.0", kind: "tool.result", requestId, ok: true, data, completedAt };
    } catch (error) {
      return { protocolVersion: "1.0", kind: "tool.result", requestId, ok: false, error: { code: "tool_execution_failed", message: error instanceof Error ? error.message.slice(0, 1000) : "Unknown error" }, completedAt };
    }
  }
}

export function validateDelegation(grant: DelegationGrant, parent?: DelegationGrant): void {
  if (grant.fromAgent === grant.toAgent) throw new Error("Self delegation is not allowed");
  if (!grant.objective.trim() || grant.objective.length > 12000) throw new Error("Invalid delegation objective");
  if (grant.depth < 0 || grant.depth > 3) throw new Error("Delegation depth exceeded");
  const expiry = Date.parse(grant.expiresAt);
  if (!Number.isFinite(expiry) || expiry <= Date.now()) throw new Error("Delegation expired");
  const calls = grant.budget?.maxToolCalls ?? 20;
  const duration = grant.budget?.maxDurationMs ?? 300000;
  if (calls < 1 || calls > 100 || duration < 1000 || duration > 3600000) throw new Error("Delegation budget exceeded");
  if (parent) {
    if (grant.parentDelegationId !== parent.delegationId || grant.depth !== parent.depth + 1) throw new Error("Delegation chain invalid");
    for (const tool of grant.scope.tools) if (!parent.scope.tools.includes(tool)) throw new Error("Tool scope escalation");
    for (const data of grant.scope.data) if (!parent.scope.data.includes(data)) throw new Error("Data scope escalation");
    for (const scope of grant.scope.scopes ?? []) if (!(parent.scope.scopes ?? []).includes(scope)) throw new Error("Permission escalation");
  }
}

export interface EnrolledDeviceSession {
  deviceId: string;
  sessionId: string;
  capabilities: Set<string>;
  lastSeen: string;
}

/** Call connect only after TLS and signed challenge verification by the transport layer. */
export class EnrolledDeviceRegistry {
  private readonly enrolled = new Set<string>();
  private readonly sessions = new Map<string, EnrolledDeviceSession>();

  enroll(deviceId: string): void {
    if (!deviceId) throw new Error("deviceId required");
    this.enrolled.add(deviceId);
  }

  connect(deviceId: string, capabilities: string[], transportAuthenticated: boolean): EnrolledDeviceSession {
    if (!transportAuthenticated) throw new Error("Device transport is not authenticated");
    if (!this.enrolled.has(deviceId)) throw new Error("Device is not enrolled");
    const session = { deviceId, sessionId: crypto.randomUUID(), capabilities: new Set(capabilities), lastSeen: new Date().toISOString() };
    this.sessions.set(deviceId, session);
    return session;
  }

  heartbeat(deviceId: string, sessionId: string): EnrolledDeviceSession {
    const session = this.sessions.get(deviceId);
    if (!session || session.sessionId !== sessionId) throw new Error("Invalid device session");
    session.lastSeen = new Date().toISOString();
    return session;
  }

  disconnect(deviceId: string, sessionId: string): void {
    if (this.sessions.get(deviceId)?.sessionId === sessionId) this.sessions.delete(deviceId);
  }
}
