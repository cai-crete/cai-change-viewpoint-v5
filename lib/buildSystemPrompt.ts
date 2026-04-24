import fs from "fs";
import path from "path";

export function buildSystemPrompt(
  principleProtocol: string,
  knowledgeDocs: string[] = []
): string {
  return [principleProtocol, ...knowledgeDocs].join("\n\n---\n\n");
}

export function loadProtocol(version = "v1"): string {
  const filePath = path.join(
    process.cwd(),
    "_context",
    `protocol-viewpoint-${version}.txt`
  );
  return fs.readFileSync(filePath, "utf-8");
}
