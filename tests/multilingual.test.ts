import assert from "node:assert/strict";
import { lex } from "../compiler/src/lexer";
import { Parser } from "../compiler/src/parser";
import { loadAliases } from "../compiler/src/dictionary";
import { checkProgram } from "../compiler/src/typeChecker";
import { generateTypeScript } from "../compiler/src/generator";

function compile(source: string, language: string): {
  ast: string;
  generated: string;
} {
  const aliases = loadAliases(language);
  const tokens = lex(source, aliases);
  const program = new Parser(tokens).parse();

  checkProgram(program);

  return {
    ast: JSON.stringify(program),
    generated: generateTypeScript(program)
  };
}

const programs = {
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
खोजें नेटवर्क_कनेक्शन
जहाँ DESTINATION_PORT == 443
बनाएं टाइमलाइन
रिपोर्ट`,

  marathi: `प्रकरण "INC-001"
संकलित प्रक्रिया
संकलित नेटवर्क_कनेक्शन
शोधा नेटवर्क_कनेक्शन
जिथे DESTINATION_PORT == 443
तयार टाइमलाइन
अहवाल`
};

const results = Object.entries(programs).map(([language, source]) => ({
  language,
  ...compile(source, language)
}));

const referenceAst = results[0].ast;
const referenceGenerated = results[0].generated;

for (const result of results) {
  if (result.ast !== referenceAst) {
    throw new Error(
      `FAIL: ${result.language} does not produce the same canonical AST`
    );
  }

  if (result.generated !== referenceGenerated) {
    throw new Error(
      `FAIL: ${result.language} does not produce the same TypeScript`
    );
  }

  console.log(
    `PASS: ${result.language} -> canonical AST -> identical TypeScript`
  );
}

console.log("");
const countSources = {
  english: `CASE "COUNT-001"
COLLECT PROCESS
COUNT PROCESS
REPORT`,

  tamil: `வழக்கு "COUNT-001"
சேகரி செயல்முறை
எண்ணிக்கை செயல்முறை
அறிக்கை`,

  hindi: `केस "COUNT-001"
एकत्र प्रक्रिया
गिनती प्रक्रिया
रिपोर्ट`,

  marathi: `प्रकरण "COUNT-001"
संकलन प्रक्रिया
मोजणी प्रक्रिया
अहवाल`
};

const countGenerated = Object.entries(countSources).map(
  ([language, source]) => {
    const ast = new Parser(
      lex(source, loadAliases(language))
    ).parse();

    return {
      language,
      code: generateTypeScript(ast)
    };
  }
);

assert.equal(
  new Set(countGenerated.map((item) => item.code)).size,
  1
);

console.log("COUNT multilingual equivalence test passed.");

const searchFileSources = {
  english: `SEARCH FILE "." "forax-search"`,

  tamil: `\u0BA4\u0BC7\u0B9F\u0BC1 \u0B95\u0BCB\u0BAA\u0BCD\u0BAA\u0BC1 "." "forax-search"`,

  hindi: `\u0924\u0932\u093E\u0936 \u092B\u093C\u093E\u0907\u0932 "." "forax-search"`,

  marathi: `\u0936\u094B\u0927\u0923\u0940 \u092B\u093E\u0907\u0932 "." "forax-search"`
};

const searchFileGenerated = Object.entries(searchFileSources).map(
  ([language, source]) => {
    const ast = new Parser(
      lex(source, loadAliases(language))
    ).parse();

    checkProgram(ast);

    return {
      language,
      code: generateTypeScript(ast)
    };
  }
);

assert.equal(
  new Set(searchFileGenerated.map((item) => item.code)).size,
  1
);

console.log("SEARCH FILE multilingual equivalence test passed.");
console.log("FORAX multilingual equivalence test passed.");



