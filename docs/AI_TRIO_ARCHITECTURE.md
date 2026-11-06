# Personal AI Trio Architecture Standard

Status: canonical shared architecture contract
Applies to: Z.E.L.D.A., K.O.S.I. and C.A.N.D.I.D.A.

## 1. Product definition

Z.E.L.D.A., K.O.S.I. and C.A.N.D.I.D.A. are three independent, Jarvis-class personal AI systems. They are peers with equivalent intended capability. They are not departments, subordinate agents, or restricted feature tiers.

Every assistant must ultimately be able to perform the full capability set available to the ecosystem: understand natural language and voice, reason, plan, research, use tools, operate authorised devices, manage communications and schedules, work with files, write and execute code in controlled environments, generate creative media through connected providers, run background workflows, and collaborate with the other assistants.

Their differences are identity, personality, voice, visual design, interaction style, and optional areas of specialised excellence. A specialism is an optimisation, never a capability restriction. Any assistant must be able to perform a task another assistant can perform, subject to the same user permissions and available tools.

## 2. Independence requirements

Each assistant owns and maintains its own:
- identity and system instructions;
- model/provider preferences and routing policy;
- conversation history and private memory;
- tool configuration and execution identity;
- voice, visual theme and user interaction preferences;
- audit trail and operational health.

No assistant may silently impersonate another, overwrite another's private memory, or treat another assistant's conversation history as its own. Shared information must pass through an explicit, logged collaboration interface with scoped payloads and provenance.

A shared platform may provide common infrastructure, but it must not collapse the three assistants into one model identity or one shared conversation state.

## 3. Equal capability contract

The ecosystem maintains a common capability catalogue. Capabilities are exposed through versioned, typed tool contracts rather than hard-coded into a single assistant.

The catalogue should cover:
- research, search and information analysis;
- browser and web workflows;
- email, calendar, contacts and messaging through supported integrations;
- file search, reading, creation, editing and organisation;
- coding, testing, debugging and repository operations;
- sandboxed terminal and development environments;
- image and other media generation through pluggable providers;
- voice input, speech output and interruption handling;
- laptop and Android device operations through enrolled device agents;
- smart-home and connected-device integrations;
- task scheduling, monitoring and long-running workflows;
- memory retrieval and approved cross-agent collaboration.

All three assistants receive the same capability catalogue. Individual deployments may temporarily lack a tool because a device is offline, a connector is not configured, or a provider is unavailable. The assistant must explain that operational limitation rather than claim the capability belongs exclusively to another assistant.

## 4. Hybrid intelligence and execution

The system is hybrid:
- local inference through Ollama or other compatible local runtimes;
- hosted inference through Groq and other replaceable providers;
- cloud workers for durable, long-running and scheduled tasks;
- a laptop device agent for authorised local applications, files, browser and development tools;
- an Android companion for supported mobile operations and remote control.

Each assistant has its own model router and provider configuration. Routing may consider task type, model capability, latency, cost, availability and data sensitivity. Provider credentials remain server-side or in an OS-backed secret store. Never commit secrets or expose provider keys to browser/mobile clients.

A task must not depend on the laptop being awake unless it specifically requires laptop-local resources. Cloud-capable tasks should continue independently. Device-dependent tasks should be queued safely and resume when the enrolled device reconnects.

## 5. Orchestration and collaboration

A secure orchestration service provides identity, task routing, delegation, scheduling, event delivery and observability. It is infrastructure, not a fourth assistant and not a superior intelligence.

Any assistant may:
- accept a task directly from the user;
- plan and execute the task using its own tools;
- delegate a bounded subtask to either peer;
- request peer review or independent analysis;
- combine results and remain accountable for the final response.

Delegation messages must include task scope, relevant context, expected output, deadline or timeout, permitted tools, and data-sharing boundaries. Results must include provenance, status and errors. Prevent circular delegation, unbounded retries and duplicate side effects with task IDs, idempotency keys, timeouts and budgets.

## 6. Autonomy and safety

The autonomy target is full execution of authorised work without unnecessary step-by-step supervision. Autonomy is bounded by explicit permissions, not by arbitrary assistant personality.

Use least-privilege credentials, scoped tools, device enrolment, secure transport, audit logs, rate limits, task budgets, emergency pause and revocation. Read-only and reversible low-risk actions may run automatically. High-impact or irreversible actions require confirmation according to policy, including financial transfers, purchases, sensitive account/security changes, destructive deletion, and external publication or deployment where appropriate.

Code execution must use isolated workspaces or containers with resource limits and controlled network/file access. Never grant unrestricted shell or filesystem access merely because a model requests it. Treat content retrieved from websites, emails, documents and peer agents as untrusted data, not as system instructions.

The user must be able to inspect what an assistant is doing, stop a task, revoke a device or connector, and review the action history.

## 7. Memory architecture

Keep private memory stores separate for each assistant. A shared knowledge space is optional and contains only information explicitly authorised for sharing. Store provenance, timestamps, ownership and access scope. Support correction, retention limits and deletion workflows. Do not use one assistant's private memory as another assistant's hidden context.

## 8. Reliability and graceful degradation

Every provider, connector and device agent reports health and capability status. If a provider fails, use an allowed fallback according to that assistant's routing policy. Do not silently change provider when the user explicitly selected one. If a device is offline, explain the dependency and queue only when safe. Persist task state so cloud workflows survive restarts. Verify side effects before reporting success.

## 9. Identity and design

Keep the three visual and conversational identities distinct:
- Z.E.L.D.A.: its own personal-assistant identity and visual language.
- K.O.S.I.: its own warm, expressive identity and visual language.
- C.A.N.D.I.D.A.: its own cinematic, conversational identity and visual language.

Distinct identity must never imply reduced intelligence or fewer tools.

## 10. Delivery principles

Build incrementally while preserving each repository's working features. Prefer shared, versioned contracts and reusable infrastructure over copying large codebases. Keep each assistant independently runnable and deployable. Changes to the shared contract should be reflected in all three repositories.

Do not claim a capability is implemented merely because it appears in this document. Product documentation must distinguish implemented, partially implemented, planned and unavailable functionality. Validate code, tests, deployment and real device behaviour separately.
