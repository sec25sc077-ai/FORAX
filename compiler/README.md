# FORAX Compiler — Phase 3

Phase 3 adds semantic checking and deterministic TypeScript generation.

Pipeline:

```text
FORAX source -> Lexer -> Parser -> AST -> Type Checker -> TypeScript Generator
```

Commands from the project root:

```bash
npm install
npm run build
npm test
npm start -- examples/english/basic.forax english
npm start -- examples/tamil/basic.forax tamil
npm start -- examples/english/basic.forax english generated.ts
```

The generated TypeScript only calls the approved `forensicRuntime` contract. Real forensic collection is intentionally deferred to Phase 4 and will be implemented as authorized, read-only/minimally invasive operations.
