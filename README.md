# TEACHMi

AI 학생에게 개념을 설명하면서 배우는 모바일 웹 서비스.

## 기술 스택

- React + Vite (JavaScript)
- CSS Modules
- React Router

## 시작하기

Node.js 설치

```bash
npm install
cp .env.example .env   # Windows PowerShell: Copy-Item .env.example .env
npm run dev
```

터미널에 표시되는 주소(보통 `http://localhost:5173`)를 브라우저에서 엶.

## 환경 변수

| 이름               | 설명                                     |
| ------------------ | ---------------------------------------- |
| `API_PROXY_TARGET` | 개발 중 `/api` 요청을 전달할 백엔드 주소 |

프론트엔드는 API를 `/api/v1`로 호출.

## 명령어

| 명령어            | 설명                |
| ----------------- | ------------------- |
| `npm run dev`     | 개발 서버 실행      |
| `npm run build`   | 배포용 빌드         |
| `npm run lint`    | 코드 규칙 검사      |
| `npm run preview` | 빌드 결과 미리 보기 |

## 폴더 구조

```text
public/            그대로 배포되는 파일 (파비콘 등)
src/
  assets/          아이콘, 캐릭터 이미지
  components/      여러 화면에서 함께 쓰는 컴포넌트
  hooks/           공통 React 훅
  pages/           화면 단위 컴포넌트
  styles/          디자인 토큰과 전역 스타일
  App.jsx          화면 경로(라우팅) 설정
  main.jsx         앱 시작 지점
```

## 디자인 규칙

- 색상과 라디우스는 `src/styles/tokens.css`의 변수를 사용.
- 화면 기준 크기는 390×844.
