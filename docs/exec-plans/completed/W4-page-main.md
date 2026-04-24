# 완료보고서 — W4: page.tsx 메인 페이지 구현

## 기본 정보
| 항목 | 값 |
|------|-----|
| 작업단위 | W4 |
| 완료일 | 2026-04-24 |
| 파일 | `app/page.tsx` |
| 태스크 커버리지 | 메인 레이아웃 조립 및 뷰 상태 관리 ✅ |
| TypeScript | 오류 없음 ✅ |

## 완료 체크리스트
- [x] 2컬럼 레이아웃 적용 (좌측 컨트롤 400px, 우측 결과 뷰 가변 할당)
- [x] 5가지 View State 구조 구현 (`image`, `viewpoint`, `result`, `isLoading`, `error`)
- [x] API Fetch 로직 통합 (`generate`, `regenerate` 함수 내 `FormData` 전송)
- [x] W1~W3 4개 컴포넌트 Props 바인딩 완료
- [x] 비활성화 정책(Disabled logic) 조건 완벽 처리
- [x] 에러 메시지 노출 UI 처리

## 구현 요약
| 항목 | 내용 |
|------|------|
| **화면 구조** | `min-h-screen`, `bg-neutral-950` 기반 Dark Theme 레이아웃 |
| **API 연동** | `POST /api/generate` 대상 Multipart 요청 전송 및 응답 할당 |
| **인터랙션** | 이미지 또는 시점 미선택 시 버튼 비활성화, 로딩 중 스피너 노출 및 인터랙션 차단 |
| **컴포넌트** | `ImageUploader`, `ViewpointController`, `ResultViewer`, `FeedbackInput` |

## 다음 단계
→ W5: API Pipeline 구현 (app/api/generate/route.ts)
