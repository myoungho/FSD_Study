# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

FSD(Feature-Sliced Design) 아키텍처를 학습하기 위한 블로그 애플리케이션 프로젝트입니다.

- **기술 스택**: React 19.1 + TypeScript 5.9 + Vite 7.1
- **아키텍처**: Feature-Sliced Design (FSD)
- **Node 버전**: v22.20.0
- **프로젝트 위치**: `my_blog/` 디렉토리

## 주요 명령어

프로젝트 루트가 아닌 `my_blog/` 디렉토리에서 실행:

```bash
cd my_blog

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# TypeScript 타입 체크 포함
tsc -b && vite build

# ESLint 실행
npm run lint

# 빌드 결과 미리보기
npm run preview
```

## FSD 아키텍처 구조

### 레이어 계층 및 의존성 규칙

```
app → pages → widgets → features → entities → shared
```

**핵심 규칙**:
- 상위 레이어는 하위 레이어만 import 가능
- 하위 레이어는 상위 레이어를 절대 import 불가
- 같은 레이어 내에서는 cross-import 금지

### 레이어별 책임

#### `app/` - 애플리케이션 진입점
- 라우터, 글로벌 프로바이더, 전역 스타일
- 비즈니스 로직이나 UI 컴포넌트 금지

#### `pages/` - 페이지 컴포넌트
- 라우트별 페이지
- 하위 레이어(widgets, features, entities, shared)를 조합
- 다른 pages import 금지

#### `widgets/` - 독립적인 복합 UI 블록
- Header, PostList, Sidebar 등
- features와 entities를 조합
- 다른 widgets import 금지

#### `features/` - 사용자 기능/비즈니스 시나리오
- CreatePost, LikePost, CommentPost 등
- 하나의 사용자 액션 = 하나의 feature
- 다른 features import 금지 (매우 중요!)
- entities와 shared만 import 가능

#### `entities/` - 비즈니스 엔티티
- Post, User, Comment 등 도메인 모델
- 순수한 데이터와 표시만
- shared만 import 가능
- 다른 entities나 features 로직 금지

#### `shared/` - 재사용 가능한 공통 코드
- UI 컴포넌트(Button, Input 등), 유틸리티, API 클라이언트
- 비즈니스 로직 없음
- 다른 레이어 import 금지

## Path Alias 설정

절대 경로 import를 사용하여 FSD 레이어 구조를 명확히 표현:

```typescript
@/*           → src/*
@/app/*       → src/app/*
@/pages/*     → src/pages/*
@/widgets/*   → src/widgets/*
@/features/*  → src/features/*
@/entities/*  → src/entities/*
@/shared/*    → src/shared/*
```

### 설정 파일

**tsconfig.app.json**에 다음 추가:
```json
{
  "compilerOptions": {
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
  }
}
```

**vite.config.ts**에 다음 추가:
```typescript
import path from 'path'

export default defineConfig({
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

## Public API 패턴

각 슬라이스는 `index.ts`를 통해 Public API만 노출:

```typescript
// features/post-create/index.ts
export { PostCreateForm } from './ui/PostCreateForm'
export { usePostCreate } from './model/usePostCreate'
export type { CreatePostData } from './model/types'

// 내부 구현은 export 금지
```

**사용 시**:
```typescript
// ✅ 올바른 사용
import { PostCreateForm } from '@/features/post-create'

// ❌ 잘못된 사용 (내부 경로 직접 접근)
import { PostCreateForm } from '@/features/post-create/ui/PostCreateForm'
```

## 세그먼트 구조

각 슬라이스 내부의 표준 세그먼트:

```
feature/post-create/
├── ui/           # UI 컴포넌트
├── model/        # 비즈니스 로직, 상태, 타입
├── api/          # API 호출
├── lib/          # 내부 유틸리티
└── index.ts      # Public API
```

## 네이밍 컨벤션

- **슬라이스**: kebab-case (예: `post-create`, `comment-delete`)
- **컴포넌트 파일**: PascalCase (예: `PostCard.tsx`)
- **훅**: camelCase (예: `usePost.ts`)
- **유틸**: camelCase (예: `formatDate.ts`)

## 학습 프로세스

프로젝트는 12단계로 구성되어 있으며, `tasks/` 디렉토리에 각 단계별 상세 가이드가 있습니다:

1. step-01-vite-setup.md - Vite 프로젝트 생성
2. step-02-tailwind-setup.md - Tailwind CSS v4 설정
3. step-03-shadcn-setup.md - Shadcn/ui 설정
4. step-04-fsd-structure.md - FSD 폴더 구조 생성
5. step-05-path-alias.md - 절대 경로 설정
6. step-06-entities.md - entities 레이어 구현
7. step-07-shared.md - shared 레이어 구현
8. step-08-features.md - features 레이어 구현
9. step-09-widgets.md - widgets 레이어 구현
10. step-10-pages.md - pages 레이어 구현
11. step-11-app.md - app 레이어 구현
12. step-12-eslint.md - ESLint + FSD 플러그인 설정

각 단계를 순서대로 진행하며 FSD 아키텍처를 학습합니다.

## Import 패턴 예시

```typescript
// pages/home/ui/HomePage.tsx
import { Header } from '@/widgets/header'
import { PostList } from '@/widgets/post-list'
import { PostCard } from '@/entities/post'
import { Button } from '@/shared/ui'

// widgets/post-list/ui/PostList.tsx
import { PostCard } from '@/entities/post'
import { LikeButton } from '@/features/post-like'
import { Pagination } from '@/shared/ui'

// features/post-create/ui/CreatePostForm.tsx
import { Post } from '@/entities/post/model'
import { Button, Input } from '@/shared/ui'

// entities/post/ui/PostCard.tsx
import { Card } from '@/shared/ui'
import { formatDate } from '@/shared/lib'
```

## 참고 자료

- [FSD 공식 문서](https://feature-sliced.design/)
- [FSD 학습 계획](./FSD_LEARNING_PLAN.md)
