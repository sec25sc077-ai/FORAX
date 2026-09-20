import assert from "node:assert/strict";
import { collectProcesses } from "../runtime/src/collectors/processCollector";

async function main(): Promise<void> {
  const processes = await collectProcesses();

  assert.ok(Array.isArray(processes));
  assert.ok(processes.length > 0);

  for (const process of processes) {
    assert.equal(typeof process.pid, "number");
    assert.ok(process.processName.length > 0);
  }

  console.log(
    `FORAX process collection passed: ${processes.length} processes collected.`
  );

  console.log(
    JSON.stringify(processes.slice(0, 5), null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});