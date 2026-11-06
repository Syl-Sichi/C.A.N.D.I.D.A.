# Shared Capability Foundation

Protocol version: 1.0

This repository implements one independent peer runtime. Z.E.L.D.A., K.O.S.I.
and C.A.N.D.I.D.A. have equal capability targets and separate identity,
configuration, history, memory, credentials and audit records.

## Contract

`contracts/agent-foundation.v1.json` is the shared wire schema. Keep the
same schema bytes in all three repositories. Breaking changes require a new
protocol version; additive optional fields may be introduced compatibly.

The runtime foundation provides:
- Namespaced tool registration and machine-readable capability manifests.
- Scope checks before execution and explicit confirmation for high/critical risk.
- Structured tool outcomes with request IDs and bounded error messages.
- Peer delegation with expiry, depth and execution budgets.
- Delegation attenuation: a child grant cannot gain tools, data or permissions
  absent from its parent grant.
- Enrolled-device sessions, heartbeat validation and explicit disconnect.

The device registry is not an authentication system. A transport must verify
TLS and a signed challenge / proof of possession before it passes
`transport_authenticated=true` to the registry. Device commands must also
be checked against enrolled-device capabilities, granted scopes, expiry and
confirmation requirements at the transport gateway.

## Independence and delegation

Each assistant runs its own runtime and owns its own model routing, system
instructions, private memory, tool registry, credentials and audit trail.
A shared protocol is not a shared mind or a hierarchy. Any peer can delegate
to either other peer. Delegated work receives only the context, tools, data
and scopes explicitly granted. Reject self-delegation, expired grants,
delegation loops, excess depth and budget overruns.

## Full screenplay-to-film capability

The shared capability catalogue includes a long-running production workflow,
not a one-prompt video clip generator. The target workflow is:

1. Read the screenplay and extract acts, scenes, dialogue, characters,
   locations, props, wardrobe, time of day and production constraints.
2. Build a production bible: character identities and approved visual
   references, voice profiles, location references, style, camera language,
   continuity rules and pronunciation guide.
3. Create a scene and shot breakdown with durations, coverage, transitions
   and dependencies. Preserve screenplay order unless the user approves edits.
4. Generate or acquire approved character, set and prop assets, then create
   scene footage in manageable shots using pluggable video-generation
   providers.
5. Generate character performances and dialogue audio, align phonemes and
   timing, then run lip-sync / facial-performance generation for each shot.
6. Assemble shots into scenes and a feature timeline; add ambience, Foley,
   music, sound design, titles, subtitles, colour and final audio mix.
7. Run continuity and quality checks for character identity, wardrobe,
   screen direction, scene geography, lip-sync, audio levels, missing shots
   and script coverage. Regenerate failed shots and retain approved takes.
8. Export the requested master and delivery formats, with project files,
   captions, credits and provenance for generated assets.

Expose this as tools such as `media.script.analyse`,
`media.film.plan`, `media.character.create`, `media.shot.generate`,
`media.performance.generate`, `media.lipsync.generate`,
`media.film.assemble`, `media.film.review` and `media.film.export`.
A production is a durable job with checkpoints, resumable stages, asset
references, provider/cost tracking and human review gates where requested.
All three assistants can invoke the complete workflow. Provider adapters may
differ, but capability parity must not.

This is a product capability target and orchestration contract. It does not
claim that a video provider, lip-sync engine, film renderer or end-to-end
production workflow is already connected or operational.

## Compatibility and security

- Never place provider keys in frontend code, mobile apps or git.
- Treat scripts, uploaded media, web pages and delegated peer output as
  untrusted input.
- Validate tool arguments against their declared input schema before calling
  handlers; enforce timeouts, quotas and idempotency at execution boundaries.
- Persist audit events for tool calls, delegation, device commands and media
  generation stages.
- Verify external side effects; do not report success based only on a request
  being accepted by a provider.
- Keep long-running film jobs in durable workers, not short-lived request
  handlers. Queue work when a required local device is offline.
