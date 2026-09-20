# FORAX — Phase 3

FORAX is a deterministic multilingual forensic domain-specific programming language.

## Phase 3

This release adds:

- semantic/type checking after parsing
- forensic-specific semantic types
- validation of `WHERE` field/operator/value combinations
- deterministic TypeScript generation
- a guarded runtime contract for generated code
- English, Tamil, Hindi and Marathi compiler tests

## Compiler pipeline

```text
Regional-language source
        ↓
       Lexer
        ↓
      Parser
        ↓
       AST
        ↓
   Type Checker
        ↓
 TypeScript Generator
        ↓
Generated TypeScript
        ↓
Forensic Runtime (Phase 4)
```

The AI layer will not be allowed to invent executable operations. It can suggest constructs from the language dictionary; the compiler remains authoritative.

## Run

From this `forax` directory:

```bash
npm install
npm run build
npm test
npm start -- examples/english/basic.forax english
npm start -- examples/tamil/basic.forax tamil
npm start -- examples/english/basic.forax english generated.ts
```

Phase 4 will connect the runtime to authorized, read-only/minimally invasive computer and network forensic collectors. This project does not implement EDR/antivirus bypass or disabling functionality.
