# FORAX Language Specification v0.1

## 1. Purpose

FORAX is a deterministic, multilingual domain-specific language for authorized computer and network forensic analysis.

The language is designed for:
- computer forensic artifact collection
- offline network/PCAP analysis
- authorized real-time network observation
- evidence integrity and reporting
- deterministic compilation to TypeScript

FORAX is not a security-evasion language. It must not disable, bypass, hide from, or defeat endpoint/network security controls.

## 2. Design principle

Regional-language keywords are lexical aliases of the same canonical token. They must produce the same AST and semantics.

AI may suggest FORAX code using only constructs present in the language dictionary. The compiler is authoritative.

## 3. Compilation pipeline

Source -> language lexer -> canonical tokens -> parser -> AST -> semantic/type validation -> TypeScript generator -> forensic runtime.

## 4. Safety model

Default forensic operations are read-only. Runtime capabilities must be explicitly declared and checked. Real-time collection is intended for systems/networks the investigator is authorized to monitor.

## 5. Program examples

```text
CASE "INC-001"
COLLECT PROCESS
COLLECT NETWORK_CONNECTION
FIND NETWORK_CONNECTION
WHERE DESTINATION_PORT == 443
CREATE TIMELINE
REPORT
```

Real-time example:

```text
CASE "LIVE-001"
START NETWORK_MONITOR
WATCH NETWORK_CONNECTION
FILTER NETWORK_CONNECTION
WHERE DESTINATION_PORT == 443
STOP NETWORK_MONITOR
REPORT
```

## 6. Correlation

FORAX supports deterministic correlation between compatible forensic evidence objects.

Current supported correlation:

```text
CORRELATE PROCESS WITH NETWORK_CONNECTION
```

This operation correlates process evidence with network connection evidence using the process identifier (PID).

Example:

```text
CASE "CORRELATION-001"
COLLECT PROCESS
COLLECT NETWORK_CONNECTION
CORRELATE PROCESS WITH NETWORK_CONNECTION
REPORT
`` 

The correlation operation is:
- read-only
- deterministic
- performed locally by the forensic runtime
- based on collected evidence
- restricted to explicitly supported object combinations

Regional-language aliases for `CORRELATE` and `WITH` map to the same canonical tokens and therefore produce the same AST and semantics.

## 7. Errors

The compiler must report:
- unknown keyword
- invalid syntax
- unknown forensic object
- unknown field
- invalid operator/type combination
- unsupported runtime operation
- unavailable platform capability
- unsafe/disallowed operation

## 8. Versioning

FORAX v0.1 is intentionally small enough to implement and test. New keywords must be added to the canonical dictionary before they are accepted by the compiler.


