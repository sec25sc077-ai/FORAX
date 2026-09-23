import http from "node:http";
import { loadAliases } from "../../compiler/src/dictionary";
import { lex } from "../../compiler/src/lexer";
import { Parser } from "../../compiler/src/parser";
import { checkProgram } from "../../compiler/src/typeChecker";
import { executeProgram } from "../../compiler/src/execute";
import { forensicRuntime } from "../../runtime/src/forensicRuntime";

const PORT = 8787;

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== "POST" || req.url !== "/api/execute") {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  try {
    let body = "";

    for await (const chunk of req) {
      body += chunk;
    }

    const request = JSON.parse(body) as {
      source?: string;
      language?: string;
    };

    const source = request.source ?? "";
    const language = request.language ?? "english";

    const aliases = loadAliases(language);
    const tokens = lex(source, aliases);
    const ast = new Parser(tokens).parse();

    checkProgram(ast);
    await executeProgram(ast);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        results: forensicRuntime.getResults()
      })
    );
  } catch (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      })
    );
  }
});

server.listen(PORT, () => {
  console.log(`FORAX Studio backend running at http://localhost:${PORT}`);
});
