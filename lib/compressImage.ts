/**
 * 클라이언트 측 이미지 압축 유틸리티
 * Canvas API를 사용하여 이미지를 리사이즈하고 JPEG 품질을 조절합니다.
 */

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB (Vercel 4.5MB 제한 대비 여유)
const MAX_DIMENSION = 2048; // 최대 가로/세로 픽셀
const INITIAL_QUALITY = 0.92;
const MIN_QUALITY = 0.5;
const QUALITY_STEP = 0.05;

/**
 * 이미지 File을 받아 4MB 이하로 압축된 File을 반환합니다.
 * 이미 4MB 이하라면 원본 그대로 반환합니다.
 */
export async function compressImage(file: File): Promise<File> {
  // 이미 충분히 작으면 원본 반환
  if (file.size <= MAX_FILE_SIZE) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  // 최대 해상도 제한
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context 생성 실패");

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // 점진적으로 품질을 낮춰가며 4MB 이하가 될 때까지 압축
  let quality = INITIAL_QUALITY;
  let blob: Blob;

  do {
    blob = await canvas.convertToBlob({
      type: "image/jpeg",
      quality,
    });

    if (blob.size <= MAX_FILE_SIZE) break;
    quality -= QUALITY_STEP;
  } while (quality >= MIN_QUALITY);

  // 그래도 크면 해상도를 추가로 줄임
  if (blob.size > MAX_FILE_SIZE) {
    const shrinkScale = 0.7;
    const smallCanvas = new OffscreenCanvas(
      Math.round(width * shrinkScale),
      Math.round(height * shrinkScale)
    );
    const smallCtx = smallCanvas.getContext("2d");
    if (!smallCtx) throw new Error("Canvas 2D context 생성 실패");

    smallCtx.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
    blob = await smallCanvas.convertToBlob({
      type: "image/jpeg",
      quality: MIN_QUALITY,
    });
  }

  const compressedFile = new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
    type: "image/jpeg",
  });

  console.log(
    `[compress] ${(file.size / 1024 / 1024).toFixed(1)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(1)}MB (quality=${quality.toFixed(2)})`
  );

  return compressedFile;
}
