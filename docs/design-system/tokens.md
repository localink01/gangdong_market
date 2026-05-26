# 디자인 토큰 가이드

작성일자: 2026-05-26

---

## 1. 컬러 토큰

### 1-1. 브랜드 컬러
- brand.50: #f0fffe
- brand.100: #d6f8f5
- brand.200: #adeff0
- brand.300: #84e6eb
- brand.400: #83e6dd
- brand.500: #83E6DD
- brand.600: #5dbab0
- brand.700: #47918f
- brand.800: #3b7372
- brand.900: #245153

### 1-2. 텍스트/중립 컬러
- ink.900: #0b0f14 (기본 본문)
- ink.700: #1e1e1e (강조 본문)
- ink.500: #616161 (보조 본문)
- ink.400: #8e8e8e (캡션)
- ink.300: #d3d3d3 (구분선/비활성)

### 1-3. 의미 컬러 (권장)
- success: #16a34a
- warning: #f59e0b
- danger: #dc2626
- info: #2563eb

---

## 2. 타이포 토큰

기본 폰트 스택:
- SF Pro Display/Text
- Pretendard Variable
- system-ui fallback

권장 스케일:
1. display: 28/34, bold
2. title-1: 22/30, bold
3. title-2: 18/26, semibold
4. headline: 16/24, semibold
5. body: 14/22, regular/medium
6. caption: 12/18, regular
7. micro: 11/16, medium

원칙:
- 한 화면에서 타이포 단계는 4단계 이내 사용
- 강조는 굵기와 색상으로, 크기 남용 금지

---

## 3. 간격/레이아웃 토큰

4px 그리드 기준:
- 4, 8, 12, 16, 20, 24, 32, 40

권장 패턴:
- 섹션 간격: 20~24
- 카드 내부 패딩: 12~16
- 화면 좌우 패딩: 16~20
- 아이콘-텍스트 간격: 6~8

---

## 4. 라운드/그림자/블러

라운드:
- sm: 10
- md: 14
- lg: 18
- xl: 24
- 4xl: 28

그림자:
- card: 0 10px 30px -12px rgba(16, 24, 40, 0.18)
- glass: inset + soft ambient shadow 조합

블러:
- glass: blur 22
- glass-strong: blur 28
- dark overlay: blur 22

---

## 5. 모션 토큰

duration:
- fast: 0.2s
- normal: 0.32s
- slow: 0.45s

easing:
- standard: cubic-bezier(.2,.8,.2,1)
- fade: ease-out

기본 애니메이션:
- slide-up
- fade-in

원칙:
- 모션은 상태 변화 설명 목적에서만 사용
- 무의미한 반복 모션 금지

---

## 6. 상태 토큰

1. 기본
- 본문 대비 4.5:1 이상

2. 활성
- brand.600 또는 강조 배경 + 그림자

3. 비활성
- 명도 상승 + 인터랙션 제거

4. 로딩
- shimmer/skeleton 사용 가능

5. 오류
- danger 계열 + 해결 액션 함께 표시
