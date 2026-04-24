<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — N05 Viewpoint Node

## 노드 식별 정보
| 항목 | 값 |
|------|-----|
| 노드 ID | N05 |
| 노드명 | Viewpoint |
| 경로 | `project_viewpoint/` |
| 역할 | 완성 건물 → 다양한 카메라 앵글 시뮬레이션 |
| Protocol | `_context/protocol-viewpoint-v1.txt` |

## 핵심 데이터 흐름
```
[이미지 업로드 + 시점 선택] (page.tsx)
  → POST /api/generate
  → buildSystemPrompt(protocol-viewpoint-v1.txt)
  → Step 1: gemini-2.5-pro 분석 → execution prompt
  → Step 2: gemini-2.0-flash-exp image I/O → 새 시점 이미지
  → 결과 표시 (page.tsx)
```

## 4가지 시점 모드
| 시점 | 좌표 | 렌즈 |
|------|------|------|
| Street View | 06:00 / 1.6m | 23mm Tilt-Shift / GFX 100S |
| Aerial View | any / >150m | 32mm / Phase One |
| Detail View | close range | 110mm Macro f/2.8 |
| Quarter View | 04:30 / standard | 45mm Standard |
