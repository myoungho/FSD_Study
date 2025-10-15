# 12단계: ESLint + FSD 플러그인 설정

## 📝 이 단계에서 배울 내용
- ESLint로 코드 품질 관리
- FSD 아키텍처 규칙 자동 검증
- Import 순서 및 의존성 규칙 강제
- 프로젝트 완성 및 배포 준비

## 🎯 왜 ESLint + FSD 플러그인이 필요한가?

### 문제:
- 🔴 개발자가 실수로 FSD 규칙 위반 (예: features → features import)
- 🔴 상위 레이어 import (예: shared → entities)
- 🔴 일관성 없는 코드 스타일

### 해결:
- ✅ **자동 검증** - 저장 시 자동으로 규칙 체크
- ✅ **즉각 피드백** - 잘못된 import를 바로 알려줌
- ✅ **팀 협업** - 모든 팀원이 같은 규칙 준수
- ✅ **코드 품질** - 일관된 스타일과 구조

## 📦 필요한 패키지 설치

```bash
# ESLint 기본
npm install -D eslint @eslint/js

# TypeScript ESLint
npm install -D typescript-eslint

# React 플러그인
npm install -D eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh

# Import 플러그인
npm install -D eslint-plugin-import eslint-plugin-import-x

# FSD 플러그인
npm install -D @feature-sliced/eslint-config

# Prettier (선택사항)
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

## 🏗️ 1. ESLint 기본 설정

### 1-1. eslint.config.js 생성
```javascript
// eslint.config.js
import js from '@eslint/js'
import typescript from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import importPlugin from 'eslint-plugin-import-x'
import { getBoundariesForFSD } from '@feature-sliced/eslint-config/boundaries'

export default typescript.config(
  // 기본 설정
  js.configs.recommended,
  ...typescript.configs.recommended,

  // React 설정
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // React 규칙
      'react/react-in-jsx-scope': 'off', // React 17+ 불필요
      'react/prop-types': 'off', // TypeScript 사용
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // TypeScript 규칙
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // Import 규칙
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js 내장 모듈
            'external', // npm 패키지
            'internal', // alias import
            ['parent', 'sibling'], // 상대 경로
            'index',
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/app/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/pages/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/widgets/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/features/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/entities/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/shared/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },

  // FSD 아키텍처 규칙
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-restricted-paths': [
        'error',
        {
          zones: getBoundariesForFSD({
            root: 'src',
          }),
        },
      ],
    },
  },

  // 제외 파일
  {
    ignores: ['dist', 'node_modules', 'vite.config.ts'],
  }
)
```

## 🏗️ 2. FSD 의존성 규칙 상세

### getBoundariesForFSD가 생성하는 규칙:

```typescript
// 예시: 자동 생성되는 규칙들
const boundaries = {
  // shared는 아무것도 import 안 함
  {
    target: './src/shared/**',
    from: './src/{entities,features,widgets,pages,app}/**',
    message: 'shared cannot import from upper layers',
  },

  // entities는 shared만 import
  {
    target: './src/entities/**',
    from: './src/{features,widgets,pages,app}/**',
    message: 'entities can only import from shared',
  },

  // features는 entities, shared만 import
  {
    target: './src/features/**',
    from: './src/{widgets,pages,app}/**',
    message: 'features cannot import from upper layers',
  },
  {
    target: './src/features/**',
    from: './src/features/**',
    message: 'features cannot import from other features',
  },

  // widgets는 features, entities, shared만 import
  {
    target: './src/widgets/**',
    from: './src/{pages,app}/**',
    message: 'widgets cannot import from pages or app',
  },
  {
    target: './src/widgets/**',
    from: './src/widgets/**',
    message: 'widgets cannot import from other widgets',
  },

  // pages는 다른 pages import 금지
  {
    target: './src/pages/**',
    from: './src/pages/**',
    message: 'pages cannot import from other pages',
  },
}
```

## 🏗️ 3. Prettier 설정 (선택사항)

### 3-1. .prettierrc 생성
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### 3-2. .prettierignore
```
dist
node_modules
*.md
```

## 🏗️ 4. VS Code 설정

### 4-1. .vscode/settings.json
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### 4-2. VS Code 확장 설치
```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss"
  ]
}
```

## 🏗️ 5. package.json 스크립트

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",
    "type-check": "tsc --noEmit"
  }
}
```

## 🧪 테스트하기

### 1. Lint 실행
```bash
npm run lint
```

### 2. 자동 수정
```bash
npm run lint:fix
```

### 3. 포맷팅
```bash
npm run format
```

### 4. 타입 체크
```bash
npm run type-check
```

## 🎨 규칙 위반 예시

### ❌ 잘못된 예:

```typescript
// features/post-create/ui/CreatePostForm.tsx

// ❌ 다른 feature import
import { LikeButton } from '@/features/post-like'
// Error: features cannot import from other features

// ❌ 상위 레이어 import
import { PostList } from '@/widgets/post-list'
// Error: features cannot import from upper layers
```

```typescript
// shared/ui/button.tsx

// ❌ 상위 레이어 import
import { Post } from '@/entities/post'
// Error: shared cannot import from upper layers
```

### ✅ 올바른 예:

```typescript
// features/post-create/ui/CreatePostForm.tsx

// ✅ entities, shared import
import { Post } from '@/entities/post'
import { Button } from '@/shared/ui/button'
import { formatDate } from '@/shared/lib'
```

```typescript
// widgets/post-list/ui/PostList.tsx

// ✅ features, entities, shared import
import { PostCard } from '@/entities/post'
import { LikeButton } from '@/features/post-like'
import { Button } from '@/shared/ui/button'
```

## 🎓 커스텀 규칙 추가

### Public API 강제하기:
```javascript
// eslint.config.js에 추가
{
  rules: {
    'import/no-internal-modules': [
      'error',
      {
        allow: [
          // shared는 내부 모듈 접근 허용
          '**/shared/**',
          // 같은 슬라이스 내부는 허용
          '**/ui/**',
          '**/model/**',
          '**/api/**',
          '**/lib/**',
        ],
      },
    ],
  },
}
```

이렇게 하면:
```typescript
// ❌ 금지
import { PostCard } from '@/entities/post/ui/PostCard'

// ✅ 허용
import { PostCard } from '@/entities/post'
```

## 🚀 빌드 및 배포

### 1. 빌드 전 체크
```bash
# 1. Lint 체크
npm run lint

# 2. 타입 체크
npm run type-check

# 3. 빌드
npm run build
```

### 2. 빌드 성공 시:
```
dist/
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── index.html
```

### 3. 미리보기
```bash
npm run preview
```

## 🎓 Git Hooks 설정 (선택사항)

### Husky + lint-staged 설치:
```bash
npm install -D husky lint-staged
npx husky init
```

### .husky/pre-commit:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### package.json에 추가:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,md}": [
      "prettier --write"
    ]
  }
}
```

이제 커밋 전에 자동으로 lint와 format이 실행됩니다!

## 🎉 완성!

### 최종 확인 체크리스트:
- ✅ ESLint 설정 완료
- ✅ FSD 규칙 자동 검증
- ✅ Import 순서 자동 정렬
- ✅ Prettier 포맷팅 (선택)
- ✅ VS Code 통합
- ✅ Git Hooks (선택)
- ✅ 빌드 성공

### 프로젝트 구조 최종 확인:
```
FSD_Study/
├── src/
│   ├── app/              ✅ 진입점, 프로바이더
│   ├── pages/            ✅ 페이지 컴포넌트
│   ├── widgets/          ✅ 복합 UI 블록
│   ├── features/         ✅ 사용자 기능
│   ├── entities/         ✅ 비즈니스 엔티티
│   └── shared/           ✅ 공통 코드
├── tasks/                ✅ 학습 가이드
├── eslint.config.js      ✅ ESLint 설정
├── tsconfig.json         ✅ TypeScript 설정
├── vite.config.ts        ✅ Vite 설정
├── tailwind.config.ts    ✅ Tailwind 설정
└── package.json          ✅ 프로젝트 설정
```

## 🎓 다음 단계

FSD 아키텍처 학습 완료! 이제 할 수 있는 것들:

### 1. 기능 확장:
- 검색 기능 (features/search)
- 북마크 기능 (features/bookmark)
- 포스트 공유 (features/share)
- 사용자 팔로우 (features/follow)

### 2. 실전 적용:
- 실제 백엔드 API 연동
- 인증/인가 구현
- React Query로 데이터 페칭 최적화
- 이미지 업로드 기능

### 3. 성능 최적화:
- Code Splitting
- Lazy Loading
- Image Optimization
- Bundle Size 최적화

### 4. 테스트:
- Unit Tests (Vitest)
- Integration Tests
- E2E Tests (Playwright)

## 📚 참고 자료

- [FSD 공식 문서](https://feature-sliced.design/)
- [ESLint 플러그인](https://github.com/feature-sliced/eslint-config)
- [실전 예제](https://github.com/feature-sliced/examples)
- [커뮤니티](https://github.com/feature-sliced/documentation/discussions)

## 🎊 축하합니다!

FSD 아키텍처를 완전히 학습하고 실전 프로젝트를 구축했습니다!

이제 확장 가능하고 유지보수하기 쉬운 프론트엔드 프로젝트를 만들 수 있습니다. 🚀
