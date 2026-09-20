# Phase 1 Test Cases

1. Every canonical keyword is unique.
2. Every regional alias maps to an existing canonical keyword.
3. English and regional examples are intended to normalize to equivalent canonical tokens.
4. Invalid keywords must eventually be rejected by the compiler.
5. DESTINATION_PORT must be treated as PORT/INTEGER-compatible for `== 443`.
6. Real-time commands must require an authorized runtime capability.
