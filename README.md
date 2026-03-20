# Palace History

Palace Skateboards 주차별 신제품 히스토리 트래커

매주 월요일 자동으로 크롤링하여 제품 목록, 가격(GBP → KRW), 사이즈 차트를 기록합니다.

## Features

- 주차별 제품 히스토리 조회
- GBP → KRW 자동 환율 변환 (관세 13% + 부가세 10% 포함)
- 제품 클릭 시 사이즈 차트 팝업
- 신규 / 재고있음 필터
- 다크 / 라이트 모드
- 모바일 반응형
- GitHub OAuth 로그인

## Tech Stack

**Frontend**
- Next.js 14 (App Router)
- styled-components
- NextAuth.js

**Backend**
- FastAPI
- SQLAlchemy + PostgreSQL
- APScheduler (매주 월요일 자동 크롤링)
- Playwright (크롤링)

**Deploy**
- Frontend: [Vercel](https://vercel.com)
- Backend: [Render](https://render.com)

## Local Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
playwright install chromium
```

`.env` 파일 생성:
```
DATABASE_URL=sqlite:///./palace.db
FRONTEND_URL=http://localhost:3000
```

```bash
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
```

`.env.local` 파일 생성:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

```bash
npm run dev
```

### 수동 크롤링

서버 실행 후 아래 요청으로 즉시 크롤링:

```bash
curl -X POST http://localhost:8000/crawl
```

## Deploy

### Render (Backend)

1. New Web Service → GitHub repo 연결
2. Root Directory: `backend`
3. Build Command: `pip install -r requirements.txt && playwright install chromium && playwright install-deps chromium`
4. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. 환경변수 설정:
   - `DATABASE_URL`: PostgreSQL URL
   - `FRONTEND_URL`: Vercel 배포 URL

### Vercel (Frontend)

1. New Project → GitHub repo 연결
2. Root Directory: `frontend`
3. 환경변수 설정:
   - `NEXT_PUBLIC_API_URL`: Render 배포 URL
   - `NEXTAUTH_URL`: Vercel 배포 URL
   - `NEXTAUTH_SECRET`: 랜덤 문자열 32자
   - `GITHUB_ID` / `GITHUB_SECRET`: GitHub OAuth App
