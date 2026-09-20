import fs from "fs";
import path from "path";

export function loadAliases(language: string): Record<string, string> {
  const filePath = path.resolve(
    process.cwd(),
    "language",
    "keywords",
    `${language}.json`
  );

  let text = fs.readFileSync(filePath, "utf8");

  // Remove UTF-8 BOM if present.
  text = text.replace(/^\uFEFF/, "");

  return JSON.parse(text);
}
