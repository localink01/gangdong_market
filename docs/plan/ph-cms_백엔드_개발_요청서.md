# ph-cms 백엔드 개발 요청서

작성일자: 2026-05-26  
요청 대상: ph-cms 백엔드 개발팀  
우선순위: High

기준 문서:
- 로컬마켓 서비스 운영 설계서 (v0.3)
- 로컬마켓 IA 및 URL 규칙 설계안 (v0.1)
- 로컬마켓 화면별 UI/UX 기획서 (v1.0)

---

## 1. 요청 목적

프론트엔드 데모를 실제 서비스로 전환하기 위해, ph-cms에 필요한 데이터 모델/권한/API/이벤트 적재 기능을 구현 요청합니다.

핵심 전제:
1. 채널 분리 정책 적용
- 웹: G-00 허용
- 앱(WebView): M-00 시작, G-00 복귀 UI 미노출

2. 알림 도메인 분리(정본)
- 멤버 알림: 상권(Market) 단위
- 단골 알림: 점포(Store) 단위

---

## 2. 이번 요청 범위 (MVP)

1. 인증/인가 및 스코프 기반 권한 검증
2. 멤버십/단골 관계 데이터 저장 및 조회
3. 멤버 알림/단골 알림 발송 API 및 이력 저장
4. 커뮤니티/단골 소식 CRUD
5. 쿠폰/스탬프 핵심 트랜잭션 저장
6. 이벤트 로그 적재 및 기본 KPI 집계 기반 제공

비범위:
1. 정교한 세그먼트 타겟 발송
2. 고급 리포트/다운로드 포맷 고도화
3. 추천 개인화 알고리즘

---

## 3. 우선 구현 백로그

### 3-1. 권한/인가 (RBAC)

필수 구현:
1. Role + Scope(region_id, market_id, store_id) 검증 미들웨어
2. 운영자 역할별 액션 제한
- 상인회: market 범위
- 점포 담당자: store 범위
- 구청: 조회 중심(read/export)
3. 스코프 불일치 시 403 반환

완료 기준:
- 모든 운영 API에 권한 미들웨어 적용
- 테스트 케이스에서 권한 우회 불가 확인

### 3-2. 핵심 관계 데이터

필수 테이블/모델:
1. membership
- user_id, region_id, market_id, status, joined_at
2. dangol_relation
- user_id, region_id, market_id, store_id, status, joined_at
3. consent
- consent_type, scope_id, agreed_at, revoked_at

완료 기준:
- 멤버십/단골 등록 및 해제 API 정상 동작
- 중복 등록 방지(유니크 제약) 적용

### 3-3. 알림 도메인 API

핵심 규칙:
1. target_type=market_members -> store_id는 null
2. target_type=store_dangol -> store_id 필수

필수 API:
1. POST /ops/regions/:regionSlug/markets/:marketSlug/notifications
- 상권 멤버 알림 발송
2. POST /ops/regions/:regionSlug/markets/:marketSlug/stores/:storeSlug/notifications
- 점포 단골 알림 발송
3. GET /notifications
- 사용자 수신 알림 목록
4. PATCH /notifications/:id/read
- 읽음 처리

완료 기준:
- 상인회는 멤버 알림만, 점포 담당자는 단골 알림만 발송 가능
- 발송 대상 수/읽음률 조회 가능

### 3-4. 피드/콘텐츠

필수 API:
1. GET/POST /regions/:regionSlug/markets/:marketSlug/feed
- 멤버 커뮤니티
2. GET/POST /regions/:regionSlug/markets/:marketSlug/stores/:storeSlug/news
- 단골 소식

권한 규칙:
1. 커뮤니티 읽기/쓰기: membership.active 필요
2. 단골 소식 읽기: dangol.active 필요

완료 기준:
- 비멤버/비단골 접근 시 권한 유도 에러코드 또는 정책 응답 반환

### 3-5. 이벤트 로그 적재

필수 필드:
1. event_name
2. occurred_at
3. channel_mode(web/app)
4. app_region_slug(nullable)
5. entry_path
6. region_id, market_id, store_id(nullable)
7. metadata(json)

필수 이벤트:
1. app_open
2. app_redirect_to_m00
3. app_out_of_region_blocked
4. web_region_selected
5. membership_registered
6. dangol_registered
7. notification_sent
8. notification_opened

완료 기준:
- 이벤트 누락률 1% 미만(내부 기준)
- 채널별(web/app) 집계 분리 가능

---

## 4. API 계약 초안

### 4-1. 멤버십 등록

POST /regions/:regionSlug/markets/:marketSlug/memberships

Request:
```json
{
  "userId": "u_123",
  "consent": {
    "membershipShare": true
  }
}
```

Response 200:
```json
{
  "membershipId": "m_001",
  "status": "active",
  "regionSlug": "gangdong-gu",
  "marketSlug": "godeok-2dong",
  "joinedAt": "2026-05-26T10:00:00Z"
}
```

### 4-2. 단골 등록

POST /regions/:regionSlug/markets/:marketSlug/stores/:storeSlug/dangol

Request:
```json
{
  "userId": "u_123",
  "consent": {
    "dangolShare": true
  }
}
```

Response 200:
```json
{
  "dangolId": "d_001",
  "status": "active",
  "storeSlug": "godeok-bakery",
  "joinedAt": "2026-05-26T10:10:00Z"
}
```

### 4-3. 알림 발송(상권 멤버)

POST /ops/regions/:regionSlug/markets/:marketSlug/notifications

Request:
```json
{
  "targetType": "market_members",
  "title": "주말 행사 안내",
  "body": "멤버 한정 쿠폰을 확인하세요",
  "sendType": "immediate"
}
```

### 4-4. 알림 발송(점포 단골)

POST /ops/regions/:regionSlug/markets/:marketSlug/stores/:storeSlug/notifications

Request:
```json
{
  "targetType": "store_dangol",
  "title": "단골 감사 쿠폰",
  "body": "오늘 방문 시 추가 혜택 제공",
  "sendType": "scheduled",
  "scheduledAt": "2026-05-27T09:00:00Z"
}
```

---

## 5. 에러 코드 제안

1. AUTH_401_UNAUTHORIZED
2. AUTH_403_SCOPE_MISMATCH
3. MEMBERSHIP_409_ALREADY_ACTIVE
4. DANGOL_412_MEMBERSHIP_REQUIRED
5. NOTIFICATION_400_INVALID_TARGET_SCOPE
6. NOTIFICATION_403_TARGET_NOT_ALLOWED
7. EVENT_400_SCHEMA_INVALID

---

## 6. QA/UAT 인수 조건

### 6-1. 권한
1. 상인회 계정이 점포 단골 알림 API 호출 시 403
2. 점포 계정이 타 점포 store_id로 발송 시 403

### 6-2. 관계
1. 멤버십 없이 단골 등록 시 412
2. 멤버십/단골 중복 생성 방지

### 6-3. 알림
1. 멤버 알림 발송 시 market 범위 사용자에게만 수신
2. 단골 알림 발송 시 해당 store 단골에게만 수신

### 6-4. 이벤트/KPI
1. web/app channel_mode 분리 집계 가능
2. app_out_of_region_blocked 집계 가능

---

## 7. 전달 산출물 요청

1. DB 마이그레이션 파일
2. API 스펙(OpenAPI 또는 동등 문서)
3. 권한 매트릭스와 코드 매핑표
4. 기본 시드 데이터(강동구, 고덕2동, 샘플 점포)
5. Postman 또는 HTTPie 테스트 컬렉션
6. 인수 테스트 결과 리포트

---

## 8. 일정 제안

1주차:
1. RBAC/관계 데이터/알림 도메인 핵심 API 구현
2. 이벤트 스키마 적재 구현

2주차:
1. 피드/쿠폰/스탬프 트랜잭션 구현
2. KPI 기본 집계 및 QA/UAT 완료

---

## 9. 커뮤니케이션 포인트

1. 알림 정책 해석 충돌 시 운영 설계서 2-3절을 정본으로 우선 적용
2. API 응답 필드 변경 시 프론트엔드 팀과 사전 합의 필수
3. 권한 예외 요청은 임시 핫픽스가 아닌 정책 문서 업데이트 후 반영
