# 1단계: Vite + React + TypeScript 프로젝트 생성

## 📝 이 단계에서 배울 내용
- Vite를 사용한 React + TypeScript 프로젝트 초기화
- Vite가 무엇이고 왜 사용하는지 이해
- 프로젝트 기본 구조 파악

## 🎯 Vite란?
**Vite**(비트)는 차세대 프론트엔드 빌드 도구입니다.

### 주요 특징:
1. **빠른 개발 서버** - ESM 기반으로 즉시 시작
2. **HMR (Hot Module Replacement)** - 빠른 핫 리로드
3. **최적화된 빌드** - Rollup 기반 프로덕션 빌드
4. **TypeScript 기본 지원** - 별도 설정 불필요

### CRA vs Vite
- ❌ Create React App: 느린 시작 시간, Webpack 기반
- ✅ Vite: 빠른 시작, 최신 표준 지원

## ✅ 실행할 명령어

### 1. Vite 프로젝트 생성
```bash
npm create vite@latest . -- --template react-ts
```

**명령어 설명:**
- `npm create vite@latest`: 최신 Vite 버전으로 프로젝트 생성
- `.`: 현재 디렉토리에 생성 (새 폴더 만들지 않음)
- `--template react-ts`: React + TypeScript 템플릿 사용

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속하여 확인

## 📂 생성되는 파일 구조

```
FSD_Study/
├── node_modules/          # 의존성 패키지
├── public/                # 정적 파일 (favicon 등)
├── src/                   # 소스 코드
│   ├── assets/           # 이미지, 폰트 등
│   ├── App.tsx           # 메인 앱 컴포넌트
│   ├── App.css           # 앱 스타일
│   ├── main.tsx          # 진입점
│   └── vite-env.d.ts     # Vite 타입 정의
├── .gitignore            # Git 제외 파일
├── index.html            # HTML 진입점
├── package.json          # 프로젝트 설정 및 의존성
├── tsconfig.json         # TypeScript 설정
├── tsconfig.node.json    # Node용 TS 설정
└── vite.config.ts        # Vite 설정
```

## 🔍 주요 파일 설명

### `index.html`
- Vite는 HTML이 진입점 (CRA와 다른 점!)
- `<script type="module" src="/src/main.tsx">` 로 TypeScript 파일 직접 로드

### `src/main.tsx`
- React 앱의 진입점
- ReactDOM으로 App 컴포넌트를 DOM에 마운트

### `vite.config.ts`
- Vite 설정 파일
- 플러그인, alias, 빌드 옵션 등 설정

### `tsconfig.json`
- TypeScript 컴파일러 설정
- strict 모드, JSX 설정 등

## 🎓 다음 단계 준비

이 단계를 완료하면:
- ✅ Vite 프로젝트가 생성됨
- ✅ 개발 서버가 실행됨
- ✅ React + TypeScript 환경 준비 완료

**다음 단계**: [2단계 - Tailwind CSS v4 설정](./step-02-tailwind-setup.md)

## ⚠️ 문제 해결

### 포트가 이미 사용 중인 경우
```bash
# vite.config.ts에 포트 변경
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### Node 버전 확인
```bash
node --version  # v22.20.0 확인
```

## 📚 참고 자료
- [Vite 공식 문서](https://vitejs.dev/)
- [Vite가 빠른 이유](https://vitejs.dev/guide/why.html)
