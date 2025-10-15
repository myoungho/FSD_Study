# 5단계: 절대 경로 import 설정 (Path Alias)

## 📝 이 단계에서 배울 내용
- 절대 경로 import가 필요한 이유
- TypeScript와 Vite에서 path alias 설정
- FSD 레이어별 alias 구성

## 🎯 왜 Path Alias가 필요한가?

### ❌ 상대 경로의 문제:
```typescript
// pages/post-detail/ui/PostDetailPage.tsx
import { PostCard } from '../../../entities/post'
import { Button } from '../../../shared/ui/button'
import { formatDate } from '../../../shared/lib/formatDate'

// 🤯 ../../../는 유지보수 악몽
// 🤯 파일 이동 시 모든 import 수정 필요
// 🤯 가독성 떨어짐
```

### ✅ 절대 경로의 장점:
```typescript
// pages/post-detail/ui/PostDetailPage.tsx
import { PostCard } from '@/entities/post'
import { Button } from '@/shared/ui/button'
import { formatDate } from '@/shared/lib/formatDate'

// ✨ 명확하고 간결
// ✨ 파일 이동해도 import 경로 동일
// ✨ FSD 레이어 구조가 명확히 보임
```

## ✅ 설정할 Path Alias

### FSD 레이어별 alias:
```typescript
@/app          → src/app
@/pages        → src/pages
@/widgets      → src/widgets
@/features     → src/features
@/entities     → src/entities
@/shared       → src/shared
```

또는 단순하게:
```typescript
@/*            → src/*
```

## 🛠️ TypeScript 설정

### 1. `tsconfig.json` 수정:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path Alias - 추가 */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/app/*": ["./src/app/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/widgets/*": ["./src/widgets/*"],
      "@/features/*": ["./src/features/*"],
      "@/entities/*": ["./src/entities/*"],
      "@/shared/*": ["./src/shared/*"]
    }
  },
  "include": ["src"]
}
```

**주요 설정:**
- `baseUrl: "."` - 기준 경로 설정
- `paths` - alias 매핑 정의

### 2. `tsconfig.app.json` 수정 (있는 경우):
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path Alias */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/app/*": ["./src/app/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/widgets/*": ["./src/widgets/*"],
      "@/features/*": ["./src/features/*"],
      "@/entities/*": ["./src/entities/*"],
      "@/shared/*": ["./src/shared/*"]
    }
  },
  "include": ["src"]
}
```

## 🛠️ Vite 설정

### `vite.config.ts` 수정:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/widgets': path.resolve(__dirname, './src/widgets'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/entities': path.resolve(__dirname, './src/entities'),
      '@/shared': path.resolve(__dirname, './src/shared'),
    },
  },
})
```

### Node 타입 설치 (path 모듈 사용):
```bash
npm install -D @types/node
```

## 🛠️ Shadcn components.json 업데이트

### `components.json` 수정:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/index.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/shared/ui",
    "utils": "@/shared/lib"
  }
}
```

**변경사항:**
- `"components": "@/components"` → `"@/shared/ui"`
- `"utils": "@/lib/utils"` → `"@/shared/lib"`

이제 Shadcn 컴포넌트가 `shared/ui`로 설치됩니다!

## 📂 기존 파일 이동

### Shadcn 컴포넌트 FSD 구조로 이동:

```bash
# shared/ui 디렉토리 생성
mkdir -p src/shared/ui
mkdir -p src/shared/lib

# 기존 컴포넌트 이동
mv src/components/ui/* src/shared/ui/
mv src/lib/utils.ts src/shared/lib/

# 기존 디렉토리 삭제
rm -rf src/components
rm -rf src/lib
```

### `shared/ui/index.ts` 생성 (Public API):
```typescript
// src/shared/ui/index.ts
export { Button } from './button'
// 추가 컴포넌트도 여기서 export
```

### `shared/lib/index.ts` 생성:
```typescript
// src/shared/lib/index.ts
export { cn } from './utils'
```

## 🧪 테스트하기

### App.tsx 수정:
```tsx
// src/App.tsx
import { Button } from '@/shared/ui/button'
// 또는
import { Button } from '@/shared/ui'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Button>Path Alias 작동 중!</Button>
    </div>
  )
}

export default App
```

개발 서버 재시작:
```bash
npm run dev
```

## 💡 사용 예시

### FSD 레이어별 import 패턴:

```typescript
// ✅ pages에서 하위 레이어 import
// pages/home/ui/HomePage.tsx
import { Header } from '@/widgets/header'
import { PostList } from '@/widgets/post-list'
import { PostCard } from '@/entities/post'
import { Button } from '@/shared/ui'

// ✅ widgets에서 features, entities import
// widgets/post-list/ui/PostList.tsx
import { PostCard } from '@/entities/post'
import { LikeButton } from '@/features/post-like'
import { Pagination } from '@/shared/ui'

// ✅ features에서 entities, shared import
// features/post-create/ui/CreatePostForm.tsx
import { Post } from '@/entities/post/model'
import { Button, Input } from '@/shared/ui'
import { cn } from '@/shared/lib'

// ✅ entities에서 shared만 import
// entities/post/ui/PostCard.tsx
import { Card } from '@/shared/ui'
import { formatDate } from '@/shared/lib'

// ✅ shared는 다른 레이어 import 안 함
// shared/ui/button.tsx
import { cn } from '@/shared/lib'
```

## 🎨 VS Code IntelliSense

### `.vscode/settings.json` 생성 (선택사항):
```json
{
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "javascript.preferences.importModuleSpecifier": "non-relative",
  "path-intellisense.mappings": {
    "@": "${workspaceRoot}/src",
    "@/app": "${workspaceRoot}/src/app",
    "@/pages": "${workspaceRoot}/src/pages",
    "@/widgets": "${workspaceRoot}/src/widgets",
    "@/features": "${workspaceRoot}/src/features",
    "@/entities": "${workspaceRoot}/src/entities",
    "@/shared": "${workspaceRoot}/src/shared"
  }
}
```

이제 자동완성이 절대 경로로 동작합니다!

## ⚠️ 문제 해결

### Import 에러 발생 시:
1. TS Server 재시작: VS Code에서 `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
2. 개발 서버 재시작
3. `node_modules` 삭제 후 재설치

### Path가 인식 안 될 때:
- `tsconfig.json`의 `baseUrl`과 `paths` 확인
- `vite.config.ts`의 `resolve.alias` 확인
- 두 파일의 경로가 일치하는지 확인

## 🎓 베스트 프랙티스

### 1. Public API 패턴 사용:
```typescript
// ✅ 좋은 예
import { PostCard } from '@/entities/post'

// ❌ 나쁜 예
import { PostCard } from '@/entities/post/ui/PostCard'
```

### 2. 레이어별 alias 활용:
```typescript
// FSD 구조가 명확히 보임
import { Header } from '@/widgets/header'
import { PostCard } from '@/entities/post'
import { Button } from '@/shared/ui'
```

### 3. 같은 레이어 내부에서는 상대 경로:
```typescript
// features/post-create/ui/CreatePostButton.tsx
import { usePostCreate } from '../model/usePostCreate'  // ✅
// import { usePostCreate } from '@/features/post-create/model/usePostCreate' // ❌ 너무 길어
```

## 🎓 다음 단계 준비

이 단계를 완료하면:
- ✅ 절대 경로 import 설정 완료
- ✅ FSD 레이어 구조가 코드에서 명확히 보임
- ✅ Shadcn 컴포넌트가 `shared/ui`에 위치
- ✅ 본격적인 FSD 구현 준비 완료

**다음 단계**: [6단계 - entities 레이어 구현](./step-06-entities.md)

## 📚 참고 자료
- [TypeScript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)
- [Vite Resolve Alias](https://vitejs.dev/config/shared-options.html#resolve-alias)
