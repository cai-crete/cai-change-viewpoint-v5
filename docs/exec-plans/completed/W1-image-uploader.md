# 완료보고서 — W1: ImageUploader 컴포넌트

## 기본 정보
| 항목 | 값 |
|------|-----|
| 작업단위 | W1 |
| 완료일 | 2026-04-24 |
| 파일 | `components/ImageUploader.tsx` |
| 태스크 커버리지 | Task 2.1 ✅ |
| TypeScript | 오류 없음 ✅ |

## 완료 체크리스트
- [x] Drag & Drop 영역 (dragover / dragleave / drop 이벤트)
- [x] 파일 선택 버튼 (input[type=file] — jpg/png/webp)
- [x] 업로드 미리보기 (원본 이미지 표시)
- [x] onImageSelect(file: File) 콜백 외부 전달
- [x] disabled 상태 처리

## 구현 요약
| 항목 | 내용 |
|------|------|
| 컴포넌트 | `ImageUploader` |
| Props | `onImageSelect: (file: File) => void`, `disabled?: boolean` |
| 상태 | `isDragging`, `preview` (ObjectURL), `fileName` |
| 허용 포맷 | image/jpeg, image/png, image/webp |
| 드래그 피드백 | border/bg 색상 전환 + 텍스트 변경 |
| 미리보기 | aspect-video 비율 유지, hover 시 "이미지 변경" 오버레이 |
| 라인 수 | 114줄 |

## 다음 단계
→ W2: ViewpointController 컴포넌트
