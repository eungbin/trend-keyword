# 트렌드 키워드

블로그 포스팅을 위한 공모전·경진대회 트렌드 키워드 수집 및 시각화 웹 서비스

## 기능

- **키워드 랭킹** — 네이버 DataLab·뉴스 API 기반 공모전/경진대회 인기 키워드 순위
- **워드 클라우드** — 키워드 빈도를 시각화 (파란색: 검색 트렌드, 초록색: 뉴스)
- **핫 주제 모달** — 키워드 클릭 시 관련 뉴스 20건을 관련도 순으로 표시
- **카테고리 필터** — 전체 / 검색 트렌드 / 뉴스 탭 전환

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| 시각화 | D3.js, d3-cloud |
| 데이터 소스 | 네이버 DataLab API, 네이버 뉴스 API |
| 배포 | Vercel |

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.local` 파일을 생성하고 네이버 개발자센터에서 발급받은 API 키를 입력합니다.

```env
NAVER_CLIENT_ID=your_client_id
NAVER_CLIENT_SECRET=your_client_secret
```

> 네이버 API 키 발급: https://developers.naver.com/apps

### 3. 개발 서버 실행

```bash
npm run dev
```

`http://localhost:3000` 에서 확인합니다.

## 폴더 구조

```
trend-keyword/
├── app/
│   ├── api/
│   │   ├── trends/route.ts     # 네이버 DataLab API (검색 트렌드)
│   │   ├── news/route.ts       # 네이버 뉴스 API (키워드 추출)
│   │   └── related/route.ts    # 키워드별 관련 뉴스 검색
│   ├── page.tsx                # 메인 대시보드
│   └── layout.tsx
├── components/
│   ├── KeywordList.tsx         # 키워드 랭킹 목록
│   ├── WordCloud.tsx           # 워드 클라우드
│   ├── CategoryFilter.tsx      # 카테고리 필터
│   └── KeywordDetailModal.tsx  # 핫 주제 모달
├── hooks/
│   └── useKeywords.ts          # 키워드 데이터 페칭 훅
└── utils/
    └── keywordProcessor.ts     # 키워드 추출·정제·필터링
```

## 배포 url
https://trend-keyword.vercel.app/
