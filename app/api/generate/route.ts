import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { buildSystemPrompt, loadProtocol } from "@/lib/buildSystemPrompt";

export const runtime = "nodejs";

const ANALYSIS_MODEL = "gemini-2.5-pro";
const GENERATION_MODEL = "gemini-3.1-flash-image-preview"; // Nano Banana 2 (Gemini 3.1 Flash Image Preview)

// Protocol Step 2 매핑 — 시점별 좌표·렌즈·우선순위 (Task 4.1~4.2)
const VIEWPOINT_SPEC: Record<string, { label: string; instruction: string }> = {
  street: {
    label: "Street View",
    instruction: [
      "TARGET: Street View / Eye Level",
      "- Vector: 06:00 (Front facade), Height 1.6m",
      "- Camera: Fujifilm GFX 100S + 23mm Tilt-Shift Lens",
      "- Perspective: 1-Point (vertical lines strictly parallel)",
      "- Priority: Zero vertical distortion, architectural stability",
    ].join("\n"),
  },
  aerial: {
    label: "Aerial View",
    instruction: [
      "TARGET: Aerial View / Bird's Eye",
      "- Vector: Any azimuth, Altitude > 150m, Pitch -45° to -90°",
      "- Camera: Phase One System + 32mm Lens",
      "- Perspective: 3-Point (converging verticals acceptable)",
      "- Priority: Full site layout, roof geometry, surrounding context",
    ].join("\n"),
  },
  detail: {
    label: "Detail View",
    instruction: [
      "TARGET: Detail View / Close-up",
      "- Vector: Any azimuth, Distance < 5m from facade",
      "- Camera: 110mm Macro Lens (f/2.8), shallow Depth of Field",
      "- Perspective: Minimal distortion at close range",
      "- Priority: Material texture, surface detail, craftsmanship",
    ].join("\n"),
  },
  quarter: {
    label: "Quarter View",
    instruction: [
      "TARGET: Quarter View / Corner Shot",
      "- Vector: 04:30 direction (45° from front-right corner)",
      "- Camera: 45mm Standard Lens, standard altitude",
      "- Perspective: 2-Point (maximize volumetric perception)",
      "- Priority: Building mass, depth, corner articulation",
    ].join("\n"),
  },
};

// Step 1 — 분석 프롬프트 조립 (V0 → V1 → Δ 구조, Task 3.2~3.4 + 4.1~4.4)
function buildAnalysisPrompt(
  viewpoint: string,
  feedback: string | null
): string {
  const spec = VIEWPOINT_SPEC[viewpoint];
  const lines = [
    "## TASK",
    `Change the viewpoint of this architectural image to: **${spec.label}**`,
    "",
    "## TARGET VIEWPOINT SPECIFICATION",
    spec.instruction,
    "",
    "## EXECUTION INSTRUCTIONS",
    "Follow the ACTION PROTOCOL in sequence:",
    "",
    "**Pre-Step — Define Δ:**",
    "- V0: Reverse-engineer the current camera position (azimuth, altitude, pitch, lens)",
    "- V1: Define precise target coordinates for the selected viewpoint above",
    "- Δ: State the orbital movement path from V0 to V1",
    "",
    "**Step 1 — Coordinate Anchoring:**",
    "- Lock the building's main facade at 06:00 (Front)",
    "- Confirm floor count, window count, proportions as Immutable Constants",
    "",
    "**Step 2 — Optical Engineering:**",
    "- Confirm camera body and lens from the specification above",
    "- State focal length and key optical parameters",
    "",
    "**Step 3 — Blind Spot Inference (Task 4.3):**",
    "- If the new viewpoint exposes hidden faces (rear/sides): extract Design DNA from visible faces",
    "- Logically place service doors, MEP equipment, ventilation following architectural grammar",
    "",
    "**Step 4 — Relighting (Task 4.4):**",
    "- Calculate new solar angle and shadow direction for the target viewpoint",
    "- Lock original material reflectivity and roughness values",
    "",
    "**Final Output — Complete Execution Prompt:**",
    "- Synthesize all steps into a single precise image generation prompt",
    "- End with: [GENERATE IMAGE NOW]",
  ];

  if (feedback) {
    lines.push(
      "",
      "## USER FEEDBACK (integrate into this simulation)",
      feedback
    );
  }

  return lines.join("\n");
}

// Step 2 — 생성 프롬프트 조립 (형태 보호 제약 추가, Task 4.5)
function buildGenerationPrompt(executionPrompt: string): string {
  return [
    executionPrompt,
    "",
    "## FORM PROTECTION SHIELD (NON-NEGOTIABLE)",
    "- Floor count: LOCKED — do not add or remove floors",
    "- Window count and placement: LOCKED — do not alter grid",
    "- Building proportions and mass: LOCKED — no geometric deformation",
    "- Material identity (concrete/glass/metal): LOCKED — texture only shifts with light",
    "- No hallucinated ornaments or structural elements",
  ].join("\n");
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const imageFile = formData.get("image") as File | null;
  const viewpoint = formData.get("viewpoint") as string | null;
  const feedback = formData.get("feedback") as string | null;

  if (!imageFile || !viewpoint) {
    return NextResponse.json(
      { error: "image와 viewpoint는 필수입니다" },
      { status: 400 }
    );
  }

  if (!VIEWPOINT_SPEC[viewpoint]) {
    return NextResponse.json(
      { error: `유효하지 않은 viewpoint: ${viewpoint}` },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY가 설정되지 않았습니다" },
      { status: 500 }
    );
  }

  try {
    const imageBytes = await imageFile.arrayBuffer();
    const imageBase64 = Buffer.from(imageBytes).toString("base64");
    const mimeType = imageFile.type as "image/jpeg" | "image/png" | "image/webp";

    const protocol = loadProtocol("v1");
    const systemPrompt = buildSystemPrompt(protocol);
    const ai = new GoogleGenAI({ apiKey });
    const startTime = Date.now();

    // Step 1: Analysis — gemini-2.5-pro (vision + structured prompt generation)
    const analysisResponse = await ai.models.generateContent({
      model: ANALYSIS_MODEL,
      config: { systemInstruction: systemPrompt },
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType, data: imageBase64 } },
            { text: buildAnalysisPrompt(viewpoint, feedback) },
          ],
        },
      ],
    });

    const executionPrompt = analysisResponse.text ?? "";

    // Step 2: Image generation — gemini-2.0-flash-exp (image I/O)
    const generationResponse = await ai.models.generateContent({
      model: GENERATION_MODEL,
      config: { responseModalities: ["IMAGE", "TEXT"] },
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType, data: imageBase64 } },
            { text: buildGenerationPrompt(executionPrompt) },
          ],
        },
      ],
    });

    const elapsed = Date.now() - startTime;
    console.log(
      `[viewpoint] viewpoint=${viewpoint} feedback=${!!feedback} elapsed=${elapsed}ms`
    );

    const parts = generationResponse.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) =>
      p.inlineData?.mimeType?.startsWith("image/")
    );

    if (!imagePart?.inlineData) {
      return NextResponse.json(
        {
          error: "이미지 생성에 실패했습니다. 다시 시도해주세요.",
          analysis: executionPrompt,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      image: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType,
      analysis: executionPrompt,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다";
    console.error("[viewpoint] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
