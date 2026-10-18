# C.A.N.D.I.D.A. Architecture
**Target: Jarvis-class Cognitive System**

> Not a chatbot. A continuous cognitive layer that anticipates, acts, remembers, and orchestrates.

---

## 1. Vision Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    AMBIENT INTELLIGENCE                      │
│         (proactive agents, continuous monitoring)            │
├─────────────────────────────────────────────────────────────┤
│                    OMNI-LINK SYSTEM                          │
│   GitHub · Web · Browser · IoT · Local Services · Voice     │
├─────────────────────────────────────────────────────────────┤
│                    AGENT CORE                                │
│     Reason → Plan → Act → Observe → Remember loop           │
├─────────────────────────────────────────────────────────────┤
│                    MEMORY TIERS                              │
│   Working · Episodic · Semantic · Procedural                │
├─────────────────────────────────────────────────────────────┤
│                    COMMAND CENTER (UI)                       │
│   Neural Chat · Memory · Tasks · Workspace · Status         │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Agent Loop (Core Runtime)

```
                  ┌──────────────┐
                  │   TRIGGER    │  (user input | schedule | event | sensor)
                  └──────┬───────┘
                         ▼
                  ┌──────────────┐
                  │  PERCEIVE    │  gather context from memory + tools + sensors
                  └──────┬───────┘
                         ▼
                  ┌──────────────┐
                  │   REASON     │  LLM + system prompt + retrieved memory
                  └──────┬───────┘
                         ▼
                  ┌──────────────┐
                  │    PLAN      │  decompose into tool calls / sub-goals
                  └──────┬───────┘
                         ▼
                  ┌──────────────┐
                  │     ACT      │  execute tools (search, code, browser, IoT…)
                  └──────┬───────┘
                         ▼
                  ┌──────────────┐
                  │   OBSERVE    │  collect results, errors, side-effects
                  └──────┬───────┘
                         ▼
                  ┌──────────────┐
                  │   REMEMBER   │  write to appropriate memory tier
                  └──────┬───────┘
                         ▼
                  ┌──────────────┐
                  │   RESPOND    │  natural language + proactive suggestions
                  └──────────────┘
```

### Loop Properties
- **Interruptible** — user can redirect mid-plan
- **Observable** — every step logged for the Command Center
- **Bounded** — max tool rounds + cost/latency guards
- **Reflective** — optional self-critique pass before final response

---

## 3. Memory Tiers

| Tier | Purpose | Persistence | Example |
|------|---------|-------------|--------|
| **Working** | Current conversation + active context window | Session / short TTL | Last 20 turns, open files |
| **Episodic** | What happened (events, decisions, outcomes) | Long-term (vector + metadata) | "User decided to prioritize Phase 2 on Oct 18" |
| **Semantic** | Facts, preferences, world knowledge | Long-term (vector + graph) | "Prefers dark UI", "Uses K.O.S.I for local inference" |
| **Procedural** | How to do things (skills, routines, tool recipes) | Long-term (code + structured) | Morning system check routine, deploy checklist |

### Memory Operations
- `encode(content, tier, metadata)`
- `retrieve(query, tiers?, k?)` → ranked results
- `update(id, patch)`
- `forget(id | filter)` (with audit)
- `summarize(range)` → compress episodic into semantic

Future: hybrid vector + knowledge graph for relationships.

---

## 4. Omni-Link Interfaces

Every external capability is a **Link** with a uniform contract:

```ts
interface OmniLink {
  id: string;
  name: string;
  description: string;
  capabilities: string[];           // e.g. ["search", "read", "write"]
  status: "online" | "degraded" | "offline";
  invoke(action: string, params: Record<string, unknown>): Promise<LinkResult>;
  healthCheck(): Promise<boolean>;
}
```

### Planned Links

| Link | Priority | Capabilities |
|------|----------|--------------|
| **LLM Provider** | P0 | chat, embed, stream |
| **Memory Store** | P0 | encode, retrieve, update |
| **Web Search** | P1 | query, summarize |
| **GitHub** | P1 | repos, files, PRs, issues, actions |
| **Browser** | P2 | navigate, extract, interact |
| **Local FS / Terminal** | P2 | read, write, exec (sandboxed) |
| **Voice I/O** | P2 | STT, TTS |
| **IoT / Home** | P3 | device state, commands |
| **Calendar / Mail** | P3 | read, create, notify |

Links register themselves; the Agent Core discovers and routes via tool schemas.

---

## 5. Tool-Calling Contract

Tools are exposed to the LLM as JSON schemas. The runtime:

1. Parses model tool-call requests
2. Validates against schema + policy (permissions, rate limits)
3. Executes via the matching Omni-Link
4. Returns structured results (or errors) back into the loop
5. Logs every call for the Task Engine / audit trail

```ts
interface ToolDefinition {
  name: string;
  description: string;
  parameters: JSONSchema;
  linkId: string;          // which Omni-Link handles it
  risk: "low" | "medium" | "high";  // high requires confirmation
}
```

---

## 6. Proactive Layer

Beyond reactive chat:

- **Suggestion Feed** — ranked next actions / insights based on context + memory
- **Background Agents** — scheduled or event-driven ("watch this repo", "morning briefing")
- **Anomaly / Opportunity Detection** — surface when something important changes
- **Routine Engine** — user-defined or learned procedures that run autonomously

The Command Center surfaces these in a dedicated proactive panel and as inline chat suggestions.

---

## 7. Security & Trust Boundaries

- **Confirmation gates** for high-risk tools (delete, push, send, purchase)
- **Sandboxed execution** for code / terminal
- **Scoped credentials** per Link (least privilege)
- **Audit log** of every agent action
- **User override** always available

---

## 8. Implementation Phases (Aligned)

| Phase | Focus | Deliverables |
|-------|--------|--------------|
| **1** ✅ | Cockpit | Command Center UI, mock chat, memory & task panels |
| **2** | Brain | Real LLM, working memory, tool-calling skeleton, persistent chat |
| **3** | Nervous System | Omni-Links (GitHub, Search, …), episodic/semantic memory |
| **4** | Autonomy | Background agents, proactive feed, routines, voice |
| **5** | Jarvis | Multi-agent coordination, ambient monitoring, full tool mesh |

---

## 9. Key Design Principles

1. **Anticipation over reaction** — always look one step ahead
2. **Memory is first-class** — not an afterthought bolted onto chat
3. **Tools over talk** — prefer action when action is possible
4. **Observable by default** — the user can always see what the system is doing
5. **Graceful degradation** — offline / partial Links still yield useful behavior
6. **Human in the loop for irreversible acts**

---

*This document is the north star. Implementation follows it; deviations require explicit decision.*
