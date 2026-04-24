# VIEWPOINT — N05 Viewpoint Node App

## 반드시 해야 하는 것들
- 모든 AI 호출은 반드시 `app/api/generate/route.ts`를 통해서만 수행
- 시스템 프롬프트는 반드시 `lib/buildSystemPrompt.ts`의 `buildSystemPrompt()`를 통해서만 구성
- Protocol 파일은 `_context/protocol-viewpoint-v[N].txt`에서 로드 (코드 하드코딩 금지)
- 이전 Protocol 버전 파일 삭제 금지

## 절대 하지 말아야 할 것들
- UI 레이어에서 Gemini API 직접 호출 금지
- Protocol 내용을 코드에 하드코딩 금지
- `_context/` 파일 무단 수정 금지

## 기술 스택
- Frontend: Next.js 15 (App Router) + Tailwind CSS
- AI Step 1: gemini-2.5-pro (vision analysis)
- AI Step 2: gemini-2.0-flash-exp (image generation)
- 환경변수: GEMINI_API_KEY
