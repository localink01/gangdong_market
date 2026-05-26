# 로컬마켓 IA 및 URL 규칙 설계안

작성일자: 2026-05-26
문서 버전: v0.1
적용 범위: 로컬마켓 멀티테넌트 구조 (지자체 확장형)

---

## 1. 설계 목표

1. 앱/웹은 하나로 유지하고 지역은 테넌트로 확장한다.
2. 사용자는 지역 -> 상권 -> 점포 흐름으로 자연스럽게 이동한다.
3. 운영자는 권한 범위(지자체/상권/점포)에 맞는 화면만 접근한다.
4. URL만 보고도 현재 컨텍스트(지역, 상권, 점포)를 해석할 수 있어야 한다.

---

## 2. IA 트리 (서비스 정보구조)

```text
로컬마켓 (Global)
├─ G-00 전체 포털
│  └─ 지역 선택 목록 (지자체 진입 전용)
│
├─ M-00 지자체 포털
│  ├─ 지자체 홈 (브랜딩명 예: 강동 hero, 공주왕도심, 익산문화거리)
│  ├─ 참여 상권 목록
│  ├─ 지자체 통합 캠페인
│  └─ 지자체 공지/리포트 (사용자 공개 범위)
│
├─ MK-00 상권 포털
│  ├─ 상권 홈 (예: 고덕2동, 천호로데오)
│  ├─ 멤버 커뮤니티 피드
│  ├─ 상점가 지도/점포 목록
│  ├─ 이벤트/쿠폰/스탬프투어
│  └─ 멤버십 등록
│
├─ ST-00 점포
│  ├─ 점포 상세
│  ├─ 단골 등록
│  ├─ 단골 전용 소식
│  ├─ 점포 쿠폰
│  └─ 스탬프 참여 지점 정보
│
├─ U-00 개인 영역
│  ├─ 내 멤버십 (다중 상권)
│  ├─ 내 단골 가게
│  ├─ 알림함
│  └─ 설정/동의 관리
│
└─ O-00 운영자 영역
   ├─ 지자체 운영 (구청/지자체)
   ├─ 상권 운영 (상인회/운영사)
   ├─ 점포 운영 (가게 담당자)
   └─ 시스템 운영 (플랫폼)
```

### 2-1. 채널 배포 정책 (중요)

1. `G-00 전체 포털`은 웹 사이트 전용 진입점으로 운영한다.
2. 모바일 앱은 `M-00 지자체 포털`부터 시작한다.
3. 각 지자체 앱은 동일한 웹 서비스를 WebView로 감싼 래퍼 앱으로 출시한다.
4. 즉, 앱은 지역별로 여러 개가 존재하지만, 백엔드/프론트 코드는 단일 서비스 기준으로 유지한다.
5. `G-00`은 지자체 선택 전용 화면으로만 사용하고, 하단 네비게이션이나 상위 내비게이션의 목적지로 삼지 않는다.
6. `M-00`은 상단바 없이 브랜딩과 상권 목록으로 구성된 지역 포털이다.

예시:
- 강동 앱(WebView 시작 URL): `/regions/gangdong-gu`
- 공주 앱(WebView 시작 URL): `/regions/gongju-si`
- 익산 앱(WebView 시작 URL): `/regions/iksan-si`

원칙:
- 웹: `G-00 -> M-00 -> MK-00 -> ST-00`
- 지역 앱(WebView): `M-00 -> MK-00 -> ST-00`
- G-00은 진입 전용이며, 브랜딩/상권 운영 UI는 M-00부터 시작한다.

### 2-2. 채널별 네비게이션 가드

| 항목 | 웹 사이트 | 지역 앱(WebView) |
|---|---|---|
| G-00 접근 | 허용 | 비허용 |
| 지역 전환 UI | 노출 | 기본 비노출 |
| M-00 이후 G-00 복귀 버튼 | 미노출(제거) | 미노출(제거) |
| 홈 버튼 동작 | 항상 해당 지자체 M-00 | 항상 해당 지자체 M-00 |
| 타 지자체 링크 클릭 | 허용 | 기본 차단 또는 현재 지자체 M-00으로 복귀 |

정책 결론:
- 서비스 하단 네비게이션에서는 채널과 무관하게 `M-00` 이후 `G-00`으로 되돌아가는 사용자 네비게이션을 제공하지 않는다.

### 2-3. 하단 네비게이션 매핑 (사용자 서비스)

하단 1차 탭은 다음과 같이 고정한다.

1. 포털 탭 -> `M-00 지자체 포털`
2. 상점가 탭 -> `MK-00 상권 포털`
3. 혜택 탭 -> `U-00-3 혜택 허브` (상권/점포 혜택 통합)
4. 마이 탭 -> `U-00-1 내 활동`

보충 규칙:
- `G-00`은 초기 진입(지자체 선택) 전용 화면으로 운영한다.
- 사용자가 `M-00`에 진입한 이후에는 하단 네비게이션으로 `G-00` 복귀 경로를 제공하지 않는다.

---

## 3. URL 구조 원칙

### 3-1. 기본 원칙

1. 공개 페이지는 SEO 가능한 path 기반 URL을 사용한다.
2. 컨텍스트 식별자는 path 파라미터로 고정한다.
3. 화면 상태(탭/필터)는 query 파라미터로 처리한다.
4. 운영자 URL은 사용자 URL과 네임스페이스를 분리한다.
5. 슬러그는 표시용, 내부 식별은 UUID/숫자 ID를 병행한다.

### 3-2. 권장 URL 패턴

```text
/{locale?}/
/{locale?}/regions
/{locale?}/regions/{regionSlug}
/{locale?}/regions/{regionSlug}/markets
/{locale?}/regions/{regionSlug}/markets/{marketSlug}
/{locale?}/regions/{regionSlug}/markets/{marketSlug}/stores
/{locale?}/regions/{regionSlug}/markets/{marketSlug}/stores/{storeSlug}
```

- locale 예시: ko-KR, en-US
- regionSlug 예시: gangdong-gu, gongju-si, iksan-si
- marketSlug 예시: godeok-2dong, cheonho-rodeo, sangil-dong
- storeSlug 예시: godeok-bakery

브랜딩 표시는 region 표시명으로 처리:
- gangdong-gu -> 강동 hero
- gongju-si -> 공주왕도심
- iksan-si -> 익산문화거리

---

## 4. 사용자용 URL 상세

### 4-1. 글로벌/지역

1. 전체 포털
- `/`
- `/regions`

정책:
- 위 경로는 웹 사이트 전용 진입 경로(G-00)로 사용한다.
- 지역 앱(WebView)에서는 기본 진입 경로로 사용하지 않는다.
- 지역 앱(WebView)에서 해당 경로로 진입 시, 앱에 바인딩된 지자체 `M-00`으로 리다이렉트한다.
- G-00 화면은 지자체 선택 리스트만 제공하고, 히어로/하단 독/상권 카드형 진입은 제공하지 않는다.

2. 지자체 포털
- `/regions/gangdong-gu` (강동 hero)
- `/regions/gongju-si` (공주왕도심)
- `/regions/iksan-si` (익산문화거리)

정책:
- 지역 앱(WebView)의 시작 URL은 반드시 해당 지자체 포털 경로를 사용한다.
- 앱 내 홈 버튼도 해당 지자체 포털(`M-00`)로 복귀시킨다.
- 앱 내 상단/사이드/탭 네비게이션에 `G-00` 진입 버튼을 두지 않는다.
- M-00은 상단 헤더를 두지 않고, 지자체 브랜드명과 참여 상권을 전면에 배치한다.

3. 지자체 내 상권 목록
- `/regions/gangdong-gu/markets`

### 4-2. 상권/점포

1. 상권 홈
- `/regions/gangdong-gu/markets/godeok-2dong`

2. 상권 탭 (query)
- `/regions/gangdong-gu/markets/godeok-2dong?tab=main`
- `/regions/gangdong-gu/markets/godeok-2dong?tab=stores&view=map`
- `/regions/gangdong-gu/markets/godeok-2dong?tab=feed&feedTab=community`

3. 점포 목록
- `/regions/gangdong-gu/markets/godeok-2dong/stores`

4. 점포 상세
- `/regions/gangdong-gu/markets/godeok-2dong/stores/godeok-bakery`

5. 단골 소식 상세
- `/regions/gangdong-gu/markets/godeok-2dong/stores/godeok-bakery/news/{newsId}`

### 4-3. 혜택/알림/내 활동

1. 혜택 허브
- `/benefits`
- `/benefits?tab=stamp`
- `/benefits?tab=coupon&status=active`

2. 알림
- `/notifications`

3. 내 활동
- `/me`
- `/me/memberships`
- `/me/dangol`
- `/me/settings`

---

## 5. 운영자용 URL 상세

운영자 영역은 `/ops` 네임스페이스로 분리한다.

### 5-1. 공통

- `/ops/login`
- `/ops`

### 5-2. 지자체 운영(구청)

- `/ops/regions/{regionSlug}/dashboard`
- `/ops/regions/{regionSlug}/reports`
- `/ops/regions/{regionSlug}/markets`

### 5-3. 상권 운영(상인회/운영사)

- `/ops/regions/{regionSlug}/markets/{marketSlug}/dashboard`
- `/ops/regions/{regionSlug}/markets/{marketSlug}/members`
- `/ops/regions/{regionSlug}/markets/{marketSlug}/feed`
- `/ops/regions/{regionSlug}/markets/{marketSlug}/campaigns`
- `/ops/regions/{regionSlug}/markets/{marketSlug}/notifications`

### 5-4. 점포 운영(가게 담당자)

- `/ops/regions/{regionSlug}/markets/{marketSlug}/stores/{storeSlug}/dashboard`
- `/ops/regions/{regionSlug}/markets/{marketSlug}/stores/{storeSlug}/dangol`
- `/ops/regions/{regionSlug}/markets/{marketSlug}/stores/{storeSlug}/news`
- `/ops/regions/{regionSlug}/markets/{marketSlug}/stores/{storeSlug}/coupons`

---

## 6. URL 파라미터/쿼리 규칙

### 6-1. Path 파라미터

1. `regionSlug`: 지자체 컨텍스트 식별
2. `marketSlug`: 상권 컨텍스트 식별
3. `storeSlug`: 점포 컨텍스트 식별
4. `newsId`: 콘텐츠 식별자

### 6-2. Query 파라미터

1. `tab`: 화면 메인 탭
2. `feedTab`: 커뮤니티/단골 소식 구분
3. `view`: list/map 구분
4. `status`: 쿠폰 상태(active/used/expired)
5. `q`: 검색 키워드
6. `sort`: 정렬 기준

규칙:
- 필수 컨텍스트는 path로 전달
- UI 상태는 query로 전달
- 민감 정보는 URL에 포함하지 않음

---

## 7. 슬러그 규칙

### 7-1. 생성 규칙

1. 소문자 영문/숫자/하이픈만 허용
2. 공백은 하이픈으로 치환
3. 길이 2~64자
4. 중복 시 접미사 숫자 부여 (`godeok-2dong-2`)

### 7-2. 표시명 분리

- URL 슬러그와 화면 표시명은 분리 저장
- 예: slug=`godeok-2dong`, displayName=`고덕2동 골목형상점가`

### 7-3. 지자체 브랜딩명 규칙

지자체 레벨은 행정명과 브랜드명을 분리해 저장한다.

| 구분 | 내부 식별자(regionSlug) | 행정명(참조) | 사용자 노출명(브랜딩) |
|---|---|---|---|
| 강동구 권역 | gangdong-gu | 강동구 | 강동 hero |
| 공주시 권역 | gongju-si | 공주시 | 공주왕도심 |
| 익산시 권역 | iksan-si | 익산시 | 익산문화거리 |

규칙:
- URL, 권한, API 스코프는 regionSlug를 기준으로 처리
- 사용자 화면(G-00, M-00, 배지/헤더)에는 브랜딩명을 우선 노출
- 운영/백오피스에서는 필요 시 브랜딩명과 행정명을 병기 가능

---

## 8. 딥링크/QR 규칙

### 8-1. QR 목적별 URL

1. 상권 유입
- `/regions/gangdong-gu/markets/godeok-2dong?entry=qr&from=poster`

2. 점포 유입
- `/regions/gangdong-gu/markets/godeok-2dong/stores/godeok-bakery?entry=qr&from=store-sign`

3. 이벤트 유입
- `/regions/gangdong-gu/markets/godeok-2dong?tab=main&campaign=spring-festa-2026&entry=qr`

### 8-2. 앱 설치/로그인 처리

1. 미로그인 상태: 로그인 후 원래 URL로 복귀
2. 비멤버 접근 제한 페이지: 멤버십 등록 시트 노출 후 복귀
3. 비단골 접근 제한 페이지: 단골 등록 유도 후 복귀

---

## 9. 권한 기반 접근 규칙

### 9-1. 사용자 페이지

1. 멤버 전용 페이지: membership.active 필요
2. 단골 전용 페이지: dangol.active 필요
3. 권한 부족 시 403 대신 유도 UX 우선(가입/등록)

### 9-2. 운영자 페이지

1. `/ops/**`는 로그인 필수
2. 역할별 접근 제어
- 구청: region 범위 조회 중심
- 상권 운영: market 범위 쓰기 가능
- 점포 운영: store 범위 쓰기 가능
3. 스코프 불일치 시 접근 차단(403)

---

## 10. 리다이렉트/레거시 호환 규칙

### 10-1. 현재 데모 경로 호환

현재 화면 state 기반 라우팅을 URL 기반으로 전환 시 아래 규칙 적용:

1. 기존 임시 경로 또는 state 진입 -> 신규 canonical URL 301/302
2. canonical URL 우선 정책 유지

### 10-3. 앱(WebView) 모드 리다이렉트 규칙

앱 모드에서는 패키지에 바인딩된 `regionSlug`를 기준으로 다음 규칙을 적용한다.

1. `/` 또는 `/regions` 진입 시
- `/{locale?}/regions/{appRegionSlug}`로 즉시 리다이렉트

2. 타 지자체 경로 진입 시
- 기본 정책: `/{locale?}/regions/{appRegionSlug}`로 리다이렉트
- 대안 정책(선택): 접근 차단 안내 후 M-00 복귀

3. 앱 내 네비게이션
- 홈: `/{locale?}/regions/{appRegionSlug}`
- G-00 이동 버튼/메뉴: 미노출

### 10-2. 대표 리다이렉트 예시

- `/market` -> `/regions/gangdong-gu/markets/godeok-2dong`
- `/store/godeok-bakery` -> `/regions/gangdong-gu/markets/godeok-2dong/stores/godeok-bakery`
- `/mypage` -> `/me`

---

## 11. 환경별 도메인 전략 (권장)

1. 웹 단일 도메인
- `localmarket.co.kr`

2. 운영자 콘솔 분리(선택)
- `ops.localmarket.co.kr`

3. 지역 서브도메인(선택)
- `gangdong.localmarket.co.kr`
- `gongju.localmarket.co.kr`

권장 순서:
- 초기: 단일 도메인 + path 기반
- 확장: 필요 시 서브도메인 병행

### 11-1. 앱(WebView) 패키징 전략

1. 지역별 앱은 WebView 래퍼로 분리 배포한다.
2. 패키지별 시작 URL은 고정한다.
- 강동 앱: `/regions/gangdong-gu`
- 공주 앱: `/regions/gongju-si`
- 익산 앱: `/regions/iksan-si`
3. `G-00`(전체 포털)는 웹 사이트에서만 노출한다.
4. 앱 내에서 타 지자체로 이동하는 링크는 기본적으로 숨기거나 제한하고, 필요 시 운영 정책으로만 허용한다.
5. 공통 웹 코드 배포 후 앱은 WebView 컨테이너 업데이트 또는 원격 설정으로 유지한다.

---

## 12. IA/URL 적용 우선순위

### 12-1. 1차 (MVP 전환)

1. 지역/상권/점포 path 구조 확정
2. 사용자 핵심 페이지 canonical URL 적용
3. `/ops` 권한 라우트 분리

### 12-2. 2차 (확장 대응)

1. 다지역 slug 정책 적용
2. 리다이렉트 룰/딥링크 룰 고도화
3. SEO 메타/사이트맵 자동화

### 12-3. 3차 (운영 최적화)

1. 캠페인 단축 URL
2. QR 파라미터 표준화
3. 지역별 분석 대시보드 URL 템플릿

---

## 13. 샘플 내비게이션 시나리오

### 시나리오 A (웹): 신규 사용자

1. `/regions` 진입
2. 강동 hero 선택 -> `/regions/gangdong-gu`
3. `/regions/gangdong-gu/markets/godeok-2dong` 진입
4. 멤버십 등록 후 `/regions/gangdong-gu/markets/godeok-2dong?tab=feed&feedTab=community` 접근

### 시나리오 B (웹/앱 공통): 점포 QR 진입

1. `/regions/gangdong-gu/markets/godeok-2dong/stores/godeok-bakery?entry=qr`
2. 비멤버면 멤버십 등록 유도
3. 멤버 후 단골 등록
4. `/regions/gangdong-gu/markets/godeok-2dong/stores/godeok-bakery/news/{newsId}` 열람

### 시나리오 C: 상권 운영자

1. `/ops/login`
2. `/ops/regions/gangdong-gu/markets/godeok-2dong/dashboard`
3. `/ops/regions/gangdong-gu/markets/godeok-2dong/notifications` 발송

### 시나리오 D (지역 앱): 강동 앱 사용자

1. 앱 실행 -> `/regions/gangdong-gu` (M-00)
2. 상권 선택 -> `/regions/gangdong-gu/markets/{marketSlug}` (MK-00)
3. 점포 이동 -> `/regions/gangdong-gu/markets/{marketSlug}/stores/{storeSlug}` (ST-00)
4. 홈 버튼 탭 -> `/regions/gangdong-gu` (M-00 복귀)
5. G-00 이동 버튼은 노출되지 않음

---

## 14. 최종 정리

권장 최종 구조는 아래 4계층이다.

1. 모든 지역 포털
2. 지자체 포털 (강동 hero/공주왕도심/익산문화거리)
3. 상권 포털 (고덕2동/천호로데오/상일동)
4. 점포

즉, 앱은 하나로 유지하고 URL 컨텍스트와 권한 스코프로 확장하는 구조를 채택한다.
