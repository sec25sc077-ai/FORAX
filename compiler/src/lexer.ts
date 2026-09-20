import { ForaxError } from "./errors";
import { Token } from "./types";

const operators = ["==", "!=", ">=", "<=", ">", "<"];

const isIdentifierStart = (ch: string): boolean => {
  return /[\p{L}\p{Nl}_]/u.test(ch);
};

const isIdentifierPart = (ch: string): boolean => {
  return /[\p{L}\p{Nl}\p{N}\p{Mn}\p{Mc}_]/u.test(ch);
};

export function lex(
  source: string,
  aliases: Record<string, string>
): Token[] {
  // Remove UTF-8 BOM if the source file contains one.
  source = source.replace(/^\uFEFF/, "");

  const tokens: Token[] = [];

  let i = 0;
  let line = 1;
  let column = 1;

  const push = (
    type: Token["type"],
    value: string,
    raw: string,
    l: number = line,
    c: number = column
  ) => {
    tokens.push({
      type,
      value,
      raw,
      line: l,
      column: c
    });
  };

  while (i < source.length) {
    const codePoint = source.codePointAt(i)!;
    const ch = String.fromCodePoint(codePoint);

    if (
      ch === " " ||
      ch === "\t" ||
      ch === "\r"
    ) {
      i += ch.length;
      column++;
      continue;
    }

    if (ch === "\n") {
      push(
        "NEWLINE",
        "\\n",
        "\\n"
      );

      i++;
      line++;
      column = 1;
      continue;
    }

    const startLine = line;
    const startColumn = column;

    if (ch === '"') {
      let j = i + 1;
      let value = "";

      while (j < source.length) {
        const cp = source.codePointAt(j)!;
        const current =
          String.fromCodePoint(cp);

        if (current === '"') {
          break;
        }

        if (current === "\n") {
          throw new ForaxError(
            "Unterminated string",
            startLine,
            startColumn
          );
        }

        value += current;
        j += current.length;
      }

      if (j >= source.length) {
        throw new ForaxError(
          "Unterminated string",
          startLine,
          startColumn
        );
      }

      const raw =
        source.slice(i, j + 1);

      push(
        "STRING",
        value,
        raw,
        startLine,
        startColumn
      );

      column += [...raw].length;
      i = j + 1;
      continue;
    }

    const op = operators.find(
      (candidate) =>
        source.startsWith(candidate, i)
    );

    if (op) {
      push(
        "OPERATOR",
        op,
        op,
        startLine,
        startColumn
      );

      i += op.length;
      column += op.length;
      continue;
    }

    if (/[0-9]/.test(ch)) {
      let j = i;

      while (j < source.length) {
        const cp = source.codePointAt(j)!;
        const current =
          String.fromCodePoint(cp);

        if (!/[0-9.]/.test(current)) {
          break;
        }

        j += current.length;
      }

      const raw =
        source.slice(i, j);

      push(
        "NUMBER",
        raw,
        raw,
        startLine,
        startColumn
      );

      column += [...raw].length;
      i = j;
      continue;
    }

    if (isIdentifierStart(ch)) {
      let j = i;

      while (j < source.length) {
        const cp = source.codePointAt(j)!;
        const current =
          String.fromCodePoint(cp);

        if (!isIdentifierPart(current)) {
          break;
        }

        j += current.length;
      }

      const raw =
        source.slice(i, j);

      const canonical =
        aliases[raw];

      push(
        canonical
          ? "KEYWORD"
          : "IDENTIFIER",
        canonical ?? raw,
        raw,
        startLine,
        startColumn
      );

      column += [...raw].length;
      i = j;
      continue;
    }

    throw new ForaxError(
      `Unexpected character '${ch}'`,
      startLine,
      startColumn
    );
  }

  push(
    "EOF",
    "",
    "",
    line,
    column
  );

  return tokens;
}
