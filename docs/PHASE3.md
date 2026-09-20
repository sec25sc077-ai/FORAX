# Phase 3 — Semantic Checking and TypeScript Generation

## Why this phase exists

The parser proves that a FORAX program has valid syntax. The Phase 3 type checker proves that the requested forensic operations are semantically valid before code generation.

Example:

```text
FIND NETWORK_CONNECTION
WHERE DESTINATION_PORT == 443
```

`DESTINATION_PORT` is defined as `INTEGER`, and `443` is an integer, so the condition is valid.

An invalid example such as:

```text
FIND NETWORK_CONNECTION
WHERE DESTINATION_PORT == "https"
```

is rejected before TypeScript generation because the field expects an integer.

## Deterministic generation

The generator maps each AST node to a fixed runtime operation. FORAX source cannot directly execute arbitrary TypeScript.

Example mapping:

```text
COLLECT PROCESS
```

becomes:

```ts
await forensicRuntime.collect("PROCESS");
```

The actual host/network collectors are a Phase 4 concern.
