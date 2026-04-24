import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  console.log("Fetching available models...");
  const response = await ai.models.list();
  for await (const model of response) {
    if (model.name.includes("3.1") || model.name.includes("image")) {
      console.log("-", model.name);
    }
  }
}
run().catch(console.error);
