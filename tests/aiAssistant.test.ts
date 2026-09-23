import assert from "node:assert/strict";
import { suggestForax } from "../ai/src/assistant";

const result = suggestForax("collect process evidence");

assert.equal(result.input, "collect process evidence");
assert.ok(Array.isArray(result.operations));
assert.equal(result.forax, "COLLECT PROCESS");

console.log("AI assistant test passed.");
