# 완료보고서 — W5: API Route 파이프라인 강화

## 기본 정보
| 항목 | 값 |
|------|-----|
| 작업단위 | W5 |
| 완료일 | 2026-04-24 |
| 파일 | `app/api/generate/route.ts` |
| 태스크 커버리지 | Task 3.2~3.4, 4.1~4.5 ✅ |
| TypeScript | 오류 없음 ✅ |

## 완료 체크리스트
- [x] feedback 필드 FormData 수신 및 분석 프롬프트 병합
- [x] 시점별 좌표·렌즈 파라미터 매핑 (VIEWPOINT_SPEC 4종)
- [x] Step 1 분석 프롬프트 구조화 (V0→V1→Δ + 4단계 프로토콜)
- [x] Step 2 생성 프롬프트에 Form Protection Shield 제약 추가
- [x] try/catch 전역 오류 처리
- [x] viewpoint 유효성 검증 강화

## 구현 요약

### VIEWPOINT_SPEC (Task 4.1~4.2)
| 시점 | 벡터 | 카메라 | 투시 |
|------|------|--------|------|
| street | 06:00 / 1.6m | GFX 100S + 23mm T/S | 1-Point |
| aerial | any / >150m | Phase One + 32mm | 3-Point |
| detail | any / <5m | 110mm Macro f/2.8 | minimal |
| quarter | 04:30 / standard | 45mm Standard | 2-Point |

### buildAnalysisPrompt (Step 1)
- V0 역추론 → V1 좌표 정의 → Δ 벡터 계산
- Blind Spot Inference 지시 포함 (Task 4.3)
- Relighting 계산 지시 포함 (Task 4.4)
- feedback 존재 시 하단 병합

### buildGenerationPrompt (Step 2)
- Step 1 실행 프롬프트 전체 포함
- Form Protection Shield 5개 제약 추가 (Task 4.5)

## 다음 단계
→ W6: 통합 검증 (W4 Gemini 완료 후 연결)
