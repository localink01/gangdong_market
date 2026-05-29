# 로컬마켓 용어/규칙 SSOT 맵

작성일자: 2026-05-29  
문서 버전: v0.4

---

## 1. 목적

본 문서는 로컬마켓의 용어, 규칙, 정책이 문서마다 다르게 해석되지 않도록 정본(SSOT) 우선순위를 고정하기 위한 운영 기준이다.

---

## 2. 정본 우선순위

1. 서비스 운영 규칙/용어/RBAC/데이터/이벤트: `로컬마켓_서비스_운영_설계서.md`
2. IA/URL/리다이렉트/채널 가드: `로컬마켓_IA_URL_설계안.md`
3. 화면 상태 분기/UX 플로우: `화면별_UIUX_기획서.md`
4. 제품 정체성/사업 모델/수익 구조: `로컬마켓_사업기획_방향_정리.md`

해석 원칙:
- 문서 간 충돌이 발생하면 위 우선순위를 따른다.
- 단, 알림 정책은 `로컬마켓_서비스_운영_설계서.md` 2-3절을 최종 정본으로 사용한다.

---

## 3. 용어 정본

- 전체 포털(Global Portal): G-00, 웹 전용 지자체 선택 진입점
- 지자체 포털(Region Portal): M-00, 앱/WebView 시작 화면
- 상권 포털(Market Portal): MK-00, 멤버십/커뮤니티/점포 탐색 허브
- 점포(Store): ST-00, 단골 전환/점포 혜택 허브
- 상점가 멤버(Membership): 사용자-상권 관계
- 가게 단골(Dangol): 사용자-점포 관계

---

## 4. 채널/진입 정본

웹:
1. `/` 또는 `/regions`는 G-00으로 진입한다.
2. G-00에서 지자체 선택 후 M-00으로 이동한다.

지역 앱(WebView):
1. 시작 URL은 해당 지자체 M-00(`/regions/{appRegionSlug}`)이다.
2. 앱 모드에서 `/` 또는 `/regions` 접근 시 M-00으로 리다이렉트한다.
3. M-00 이후 G-00 복귀 버튼/메뉴는 제공하지 않는다.

공통:
1. 하단 네비게이션의 포털 탭 목적지는 M-00이다.
2. G-00은 초기 선택 전용 화면이며 하단 네비게이션 목적지로 사용하지 않는다.

---

## 5. 알림 도메인 정본

1. 멤버 알림: market 단위 발송
2. 단골 알림: store 단위 발송
3. `target_type=market_members`면 `store_id=null`
4. `target_type=store_dangol`면 `store_id` 필수

---

## 6. URL/컨텍스트 정본

1. 컨텍스트는 path 파라미터로 고정한다: `regionSlug/marketSlug/storeSlug`
2. 화면 상태는 query 파라미터로 처리한다: `tab`, `feedTab`, `view`, `status`
3. 운영자 영역은 `/ops/**` 네임스페이스로 분리한다.

---

## 7. 변경 운영 규칙

1. 규칙 변경 시 아래 문서를 같은 커밋에서 동시 반영한다.
- `로컬마켓_서비스_운영_설계서.md`
- `로컬마켓_IA_URL_설계안.md`
- `화면별_UIUX_기획서.md`
2. 변경 이력에는 무엇을 바꿨는지와 왜 바꿨는지를 1~2문장으로 남긴다.
3. QA/UAT 체크리스트와 이벤트 로깅 영향 여부를 함께 점검한다.

---

## 8. 용어 사전 운영 규칙

1. 하나의 개념에는 대표 용어를 하나만 사용한다.
2. 사용자 노출 용어와 내부 식별자(영문 키)는 분리해 기록한다.
3. 금지어/혼동어를 함께 정의해 문서/화면/API에서 재사용을 차단한다.
4. 용어 변경 시 본 문서와 아래 3개 문서를 같은 커밋에서 동시 수정한다.
- 로컬마켓_서비스_운영_설계서.md
- 로컬마켓_IA_URL_설계안.md
- 화면별_UIUX_기획서.md
5. 용어 추가/수정은 상태값으로 관리한다: proposed, approved, deprecated.
6. 사용자 노출 용어는 `가게`로 통일하고, 내부 식별자/데이터 키는 `store`를 유지한다.

---

## 9. 용어 사전 템플릿

아래 항목을 모두 채운 항목만 approved로 승격한다.

| 필드 | 설명 |
|---|---|
| 용어 ID | TERM-001 형식의 고유 ID |
| 대표 용어(국문) | 화면/기획에서 사용하는 단일 대표명 |
| 내부 식별자(영문) | API/이벤트/데이터 모델 기준 키 |
| 정의 | 한 문장 정의 |
| 범위 레벨 | Global/Region/Market/Store/User/Ops |
| 사용자 노출 문구 | 버튼, 배지, 안내 문구 |
| 금지어/혼동어 | 사용 금지 또는 대체 필요 용어 |
| 참조 데이터 키 | 관련 테이블/필드 |
| 참조 이벤트 키 | 관련 이벤트명 |
| 상태 | proposed/approved/deprecated |

---

## 10. 핵심 용어 사전 (초기 동결안)

| 용어 ID | 대표 용어(국문) | 내부 식별자(영문) | 정의 | 범위 레벨 | 사용자 노출 문구 | 금지어/혼동어 | 참조 데이터 키 | 참조 이벤트 키 | 상태 |
|---|---|---|---|---|---|---|---|---|---|
| TERM-001 | 전체 포털 | global_portal | 모든 지자체 진입 전 선택 허브 | Global | 지자체 선택 | 전체 홈(앱) | screen=portal | app_open, web_region_selected | approved |
| TERM-002 | 지자체 포털 | region_portal | 선택된 지자체의 상권 목록/캠페인 허브 | Region | 강동 hero 포털 | 지역 홈, 메인 홈 | screen=region, region_slug | app_redirect_to_m00 | approved |
| TERM-003 | 상권 포털 | market_portal | 멤버 전환과 가게 탐색의 중심 화면 | Market | 상권 홈 | 시장 메인 | screen=market, market_slug | view_market_home | approved |
| TERM-004 | 가게 상세 | store_detail | 개별 가게 정보와 단골 전환 화면 | Store | 가게 상세 보기 | 점포 상세(사용자 노출) | screen=store, store_id | click_dangol_register | approved |
| TERM-005 | 상점가 멤버 | membership | 사용자와 상권 간 관계 | Market | 상점가 멤버 가입 | 상권 단골, 상점가 단골 | membership.status | click_membership_register, membership_registered | approved |
| TERM-006 | 가게 단골 | dangol_relation | 사용자와 가게 간 관계 | Store | 이 가게 단골 등록 | 점포 멤버십 | dangol_relation.status | click_dangol_register, dangol_registered | approved |
| TERM-007 | 멤버 알림 | market_members_notification | 상권 단위 멤버 대상 알림 | Market | 상점가 공지 알림 | 시장 단골 알림 | notification.target_type=market_members | notification_sent, notification_opened | approved |
| TERM-008 | 단골 알림 | store_dangol_notification | 가게 단위 단골 대상 알림 | Store | 가게 단골 소식 | 멤버 전체 알림 | notification.target_type=store_dangol, notification.store_id | notification_sent, notification_opened | approved |
| TERM-009 | 상인회 담당자 | merchant_council_admin | 상권 운영 권한을 가진 운영자 | Ops/Market | 상인회 관리자 | 시장 관리자(모호) | operator.role=merchant_council_admin | notification_sent | approved |
| TERM-010 | 가게 담당자 | store_admin | 가게 운영 권한을 가진 운영자 | Ops/Store | 가게 관리자 | 매장 오너(권한 불명확) | operator.role=store_admin, scope.store_id | feed_post_created, notification_sent | approved |
| TERM-011 | 상점가 멤버 커뮤니티 | member_community_feed | 상점가 멤버만 접근 가능한 커뮤니티 피드 | Market | 멤버 커뮤니티 | 상권 자유게시판(개방형 오해) | community_post.visibility=member_only | feed_post_created | approved |
| TERM-012 | 가게 단골 소식 | store_dangol_news | 특정 가게 단골에게 제공되는 소식 피드 | Store | 단골 소식 | 상점가 전체 소식 | store_news.visibility=dangol_only | notification_sent, notification_opened | approved |
| TERM-013 | 스탬프투어 | stamp_tour | 가게 방문 미션형 참여 기능 | Market | 스탬프투어 (후속 예정) | MVP 필수 기능 오해 | [DEFERRED_MVP] stamp_tour, stamp_event, tour_progress | [DEFERRED_MVP] stamp_checked, tour_completed | proposed |

운영 메모:
- TERM-013 스탬프투어는 현재 개발 착수 범위(MVP)에서 구현하지 않는다.
- 본 문서에서 스탬프투어가 언급되더라도 후속 고도화 기능으로 해석한다.
- 구현 티켓/백로그에서 TERM-013은 `[DEFERRED_MVP]` 태그로 분류한다.

---

## 11. 동결/변경 이력

| 버전 | 일자 | 변경 내용 | 사유 |
|---|---|---|---|
| v0.1 | 2026-05-29 | SSOT 기본 골격 작성 | 문서 간 규칙 충돌 방지 |
| v0.2 | 2026-05-29 | 용어 사전 운영 규칙, 템플릿, 핵심 10개 용어 추가 | 개발 착수 전 용어 동결 기준 수립 |
| v0.3 | 2026-05-29 | 사용자 노출 용어를 `가게`로 통일하고, 멤버 커뮤니티/단골 소식 용어를 추가 | UI 용어 혼재 해소 및 기능 용어 명시 |
| v0.4 | 2026-05-29 | 스탬프투어를 TERM-013(proposed)로 분리하고 MVP 미구현 정책을 명시 | 구현 범위 오해 방지 |
