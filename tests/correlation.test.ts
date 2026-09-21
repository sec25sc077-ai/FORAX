const { forensicRuntime } = require("../runtime/src/forensicRuntime");

async function run() {
  const result =
    await forensicRuntime.correlateProcessNetwork();

  if (
    result.operation !==
    "CORRELATE_PROCESS_NETWORK_CONNECTION"
  ) {
    throw new Error(
      "FAIL: correlation operation name is incorrect"
    );
  }

  if (result.object !== "CORRELATION") {
    throw new Error(
      "FAIL: correlation object is incorrect"
    );
  }

  const data = result.data;

  if (data.status !== "COMPLETED") {
    throw new Error(
      "FAIL: correlation did not complete"
    );
  }

  if (
    data.correlationType !==
    "PROCESS_NETWORK_PID"
  ) {
    throw new Error(
      "FAIL: correlation type is incorrect"
    );
  }

  if (!Array.isArray(data.results)) {
    throw new Error(
      "FAIL: correlation results are not an array"
    );
  }

  console.log(
    "PASS: PROCESS ? NETWORK_CONNECTION correlation runtime test"
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
