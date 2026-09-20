import assert from "node:assert/strict";
import { lex } from "../compiler/src/lexer";
import { loadAliases } from "../compiler/src/dictionary";
import { Parser } from "../compiler/src/parser";
import { checkProgram } from "../compiler/src/typeChecker";
import { generateTypeScript } from "../compiler/src/generator";

const samples: Record<string, string> = {
  english: `CASE "INC-001"
COLLECT PROCESS
COLLECT NETWORK_CONNECTION
FIND NETWORK_CONNECTION
WHERE DESTINATION_PORT == 443
CREATE TIMELINE
REPORT`,

  tamil: `வழக்கு "INC-001"
சேகரி செயல்முறை
சேகரி பிணைய_இணைப்பு
கண்டுபிடி பிணைய_இணைப்பு
எங்கே DESTINATION_PORT == 443
உருவாக்கு காலவரிசை
அறிக்கை`,

  hindi: `मामला "INC-001"
एकत्र प्रक्रिया
एकत्र नेटवर्क_कनेक्शन
खोज नेटवर्क_कनेक्शन
जहाँ DESTINATION_PORT == 443
बनाएँ समयरेखा
रिपोर्ट`,

  marathi: `प्रकरण "INC-001"
संकलित प्रक्रिया
संकलित नेटवर्क_कनेक्शन
शोध नेटवर्क_कनेक्शन
जिथे DESTINATION_PORT == 443
तयार कालरेषा
अहवाल`
};

for (const [language, source] of Object.entries(samples)) {
  const ast = new Parser(
    lex(source, loadAliases(language))
  ).parse();

  checkProgram(ast);

  assert.equal(ast.type, "Program");
  assert.equal(ast.statements.length, 6);
}

const ast = new Parser(
  lex(samples.english, loadAliases("english"))
).parse();

checkProgram(ast);

const ts = generateTypeScript(ast);

assert.match(
  ts,
  /forensicRuntime\.collect\("PROCESS"\)/
);

assert.match(
  ts,
  /forensicRuntime\.find\("NETWORK_CONNECTION"/
);

assert.match(ts, /DESTINATION_PORT/);


const correlationSource = `CASE "CORRELATION-001"
COLLECT PROCESS
COLLECT NETWORK_CONNECTION
CORRELATE PROCESS WITH NETWORK_CONNECTION
REPORT`;

const correlationAst = new Parser(
  lex(correlationSource, loadAliases("english"))
).parse();

checkProgram(correlationAst);

assert.equal(
  correlationAst.statements.some(
    (statement) => statement.type === "CorrelateStatement"
  ),
  true
);

const correlationTs = generateTypeScript(correlationAst);

assert.match(
  correlationTs,
  /forensicRuntime\.correlateProcessNetwork\(\)/
);
const countSource = `CASE "COUNT-001"
COLLECT PROCESS
COUNT PROCESS
REPORT`;

const countAst = new Parser(
  lex(countSource, loadAliases("english"))
).parse();

assert.equal(
  countAst.statements.some(
    (statement) => statement.type === "CountStatement"
  ),
  true
);

const countTs = generateTypeScript(countAst);

assert.match(
  countTs,
  /forensicRuntime\.count\("PROCESS", undefined\)/
);

const summarizeSource = `CASE "SUMMARIZE-001"
COLLECT PROCESS
SUMMARIZE PROCESS
REPORT`;

const summarizeAst = new Parser(
  lex(summarizeSource, loadAliases("english"))
).parse();

checkProgram(summarizeAst);

assert.equal(
  summarizeAst.statements.some(
    (statement) => statement.type === "SummarizeProcessStatement"
  ),
  true
);

const summarizeTs = generateTypeScript(summarizeAst);

assert.match(
  summarizeTs,
  /forensicRuntime\.summarizeProcess\(\)/
);

const summarizeMultilingualSamples: Record<string, string> = {
  english: `CASE "SUMMARIZE-MULTI-001"
SUMMARIZE PROCESS
REPORT`,

  tamil: `வழக்கு "SUMMARIZE-MULTI-001"
சுருக்குக செயல்முறை
அறிக்கை`,

  hindi: `मामला "SUMMARIZE-MULTI-001"
सारांश प्रक्रिया
रिपोर्ट`,

  marathi: `प्रकरण "SUMMARIZE-MULTI-001"
सारांश प्रक्रिया
अहवाल`
};

for (const [language, source] of Object.entries(summarizeMultilingualSamples)) {
  const multilingualAst = new Parser(
    lex(source, loadAliases(language))
  ).parse();

  checkProgram(multilingualAst);

  const multilingualTs = generateTypeScript(multilingualAst);

  assert.match(
    multilingualTs,
    /forensicRuntime\.summarizeProcess\(\)/
  );
}
console.log("Phase 3 compiler tests passed.");




