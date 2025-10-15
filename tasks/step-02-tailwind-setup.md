# 2단계: Tailwind CSS v4 설정 및 구성

## 📝 이 단계에서 배울 내용
- Tailwind CSS v4 설치 및 설정
- Vite와 Tailwind 통합
- 기본 스타일 적용 및 테스트

## 🎯 Tailwind CSS v4란?

**Tailwind CSS**는 유틸리티 우선(Utility-First) CSS 프레임워크입니다.

### v4의 주요 변화:
1. **새로운 엔진** - Oxide 엔진으로 성능 대폭 향상
2. **Zero-config** - PostCSS 설정 불필요
3. **CSS 네이티브** - `@import` 사용
4. **더 빠른 빌드** - 이전 버전 대비 10배 빠름

### 왜 Tailwind인가?
- ✅ 빠른 UI 개발
- ✅ 일관된 디자인 시스템
- ✅ 작은 번들 사이즈 (사용한 클래스만 포함)
- ✅ 반응형 디자인 쉬움

## ✅ 실행할 명령어

### 1. Tailwind CSS v4 설치
```bash
npm install tailwindcss@next @tailwindcss/vite@next
```

**패키지 설명:**
- `tailwindcss@next`: Tailwind CSS v4 (현재 베타)
- `@tailwindcss/vite@next`: Vite 플러그인

### 2. Vite 설정 업데이트

`vite.config.ts` 파일 수정:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### 3. CSS 파일 생성 및 설정

`src/index.css` 파일 생성 (기존 파일 있으면 교체):
```css
@import "tailwindcss";
```

### 4. main.tsx에 CSS import

`src/main.tsx`에서 CSS 임포트 확인:
```typescript
import './index.css'
```

## 🧪 테스트하기

### App.tsx 수정하여 테스트
```tsx
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Tailwind CSS v4 작동 중!
        </h1>
        <p className="text-gray-600">
          FSD 아키텍처 학습 프로젝트
        </p>
      </div>
    </div>
  )
}

export default App
```

개발 서버를 실행하고 확인:
```bash
npm run dev
```

## 📐 Tailwind v4 주요 기능

### 1. 커스텀 테마 (필요시)
`tailwind.config.ts` 파일 생성:
```typescript
import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
      },
    },
  },
} satisfies Config
```

### 2. 다크 모드
```tsx
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">제목</h1>
</div>
```

### 3. 반응형 디자인
```tsx
<div className="text-sm md:text-base lg:text-lg">
  반응형 텍스트
</div>
```

## 🎨 유용한 Tailwind 클래스

### 레이아웃
- `flex`, `grid` - 플렉스박스, 그리드
- `container` - 컨테이너
- `mx-auto` - 수평 중앙 정렬

### 스페이싱
- `p-4` - padding: 1rem
- `m-4` - margin: 1rem
- `space-x-4` - 자식 요소 간격

### 타이포그래피
- `text-lg`, `text-xl` - 폰트 크기
- `font-bold` - 굵은 글씨
- `text-center` - 텍스트 중앙 정렬

### 색상
- `bg-blue-500` - 배경색
- `text-gray-800` - 텍스트 색상
- `border-red-500` - 테두리 색상

## 🎓 FSD와 Tailwind

FSD 아키텍처에서 Tailwind 사용:
- **shared/ui** - 재사용 가능한 UI 컴포넌트에 Tailwind 클래스
- **일관성** - 디자인 토큰으로 일관된 스타일
- **분리** - 컴포넌트별로 스타일 격리

## ⚠️ 문제 해결

### 스타일이 적용 안 됨
1. `vite.config.ts`에 플러그인 추가 확인
2. `src/index.css`에 `@import "tailwindcss"` 확인
3. `main.tsx`에서 CSS import 확인
4. 개발 서버 재시작

### IntelliSense 작동 안 함
VS Code에 Tailwind CSS IntelliSense 확장 설치:
```bash
# VS Code Extensions
Tailwind CSS IntelliSense
```

## 🎓 다음 단계 준비

이 단계를 완료하면:
- ✅ Tailwind CSS v4 설정 완료
- ✅ 유틸리티 클래스로 스타일링 가능
- ✅ 반응형 디자인 준비 완료

**다음 단계**: [3단계 - Shadcn/ui 설정](./step-03-shadcn-setup.md)

## 📚 참고 자료
- [Tailwind CSS v4 문서](https://tailwindcss.com/docs)
- [Tailwind 치트시트](https://nerdcave.com/tailwind-cheat-sheet)
