# 4단계: FSD 폴더 구조 생성 및 설명

## 📝 이 단계에서 배울 내용
- FSD 아키텍처의 핵심 개념
- 각 레이어의 역할과 책임
- 의존성 규칙과 import 규칙
- 실제 폴더 구조 생성

## 🎯 FSD 핵심 개념

### Feature-Sliced Design의 3가지 원칙:

#### 1️⃣ **레이어 분리 (Layers)**
앱을 표준화된 레이어로 분리:
```
app → pages → widgets → features → entities → shared
```

#### 2️⃣ **슬라이스 (Slices)**
각 레이어 안에서 비즈니스 도메인으로 분리:
```
features/
├── auth/           # 인증 관련 기능
├── post-create/    # 포스트 생성 기능
└── post-like/      # 포스트 좋아요 기능
```

#### 3️⃣ **세그먼트 (Segments)**
각 슬라이스 안에서 코드를 목적별로 분리:
```
features/post-create/
├── ui/             # UI 컴포넌트
├── model/          # 비즈니스 로직, 상태
├── api/            # API 호출
└── index.ts        # Public API
```

## 📊 FSD 레이어 상세 설명

### 🔷 **app** (가장 상위)
**역할:** 애플리케이션 진입점 및 글로벌 설정
```
app/
├── providers/      # Context, Theme, React Query 등
├── router/         # 라우팅 설정
├── styles/         # 글로벌 스타일
└── main.tsx        # 앱 진입점
```

**예시:**
- 라우터 설정
- 전역 Provider (Theme, Auth, Query Client)
- 전역 에러 바운더리
- 초기화 로직

**규칙:**
- ❌ 비즈니스 로직 금지
- ❌ UI 컴포넌트 금지
- ✅ 설정과 조합만

---

### 🔷 **pages**
**역할:** 라우트별 페이지 컴포넌트
```
pages/
├── home/           # 홈페이지
├── post-detail/    # 포스트 상세 페이지
├── post-create/    # 포스트 작성 페이지
└── profile/        # 프로필 페이지
```

**예시:**
- HomePage - 블로그 메인
- PostDetailPage - 포스트 상세
- ProfilePage - 사용자 프로필

**규칙:**
- ✅ widgets, features, entities, shared import 가능
- ✅ 다른 pages는 import 금지
- 🎯 페이지는 레고 블록을 조합하는 역할

---

### 🔷 **widgets**
**역할:** 독립적인 복합 UI 블록
```
widgets/
├── header/         # 헤더 (nav + user menu)
├── post-list/      # 포스트 목록 (여러 features 조합)
├── sidebar/        # 사이드바
└── footer/         # 푸터
```

**예시:**
- Header - 로고 + 네비게이션 + 사용자 메뉴
- PostList - 포스트 카드 + 페이지네이션 + 필터
- CommentSection - 댓글 목록 + 작성 폼

**규칙:**
- ✅ features, entities, shared import 가능
- ❌ 다른 widgets import 금지
- 🎯 여러 features를 조합하여 큰 블록 생성

---

### 🔷 **features**
**역할:** 사용자 시나리오/비즈니스 기능
```
features/
├── auth/                    # 인증
│   ├── login/              # 로그인 기능
│   └── logout/             # 로그아웃 기능
├── post-create/            # 포스트 작성
├── post-edit/              # 포스트 수정
├── post-like/              # 포스트 좋아요
├── comment-create/         # 댓글 작성
└── comment-delete/         # 댓글 삭제
```

**예시:**
- CreatePost - 포스트 작성 폼 + 저장 로직
- LikePost - 좋아요 버튼 + 토글 로직
- DeleteComment - 삭제 버튼 + 확인 다이얼로그

**규칙:**
- ✅ entities, shared import 가능
- ❌ 다른 features import 금지 (중요!)
- 🎯 하나의 사용자 액션 = 하나의 feature

---

### 🔷 **entities**
**역할:** 비즈니스 엔티티 (도메인 모델)
```
entities/
├── post/           # 포스트 엔티티
│   ├── ui/        # PostCard 등 표시 컴포넌트
│   ├── model/     # 타입, 스키마
│   └── api/       # CRUD API
├── user/           # 사용자 엔티티
├── comment/        # 댓글 엔티티
└── category/       # 카테고리 엔티티
```

**예시:**
- post - 포스트 데이터, PostCard, API
- user - 사용자 데이터, UserAvatar, API
- comment - 댓글 데이터, CommentItem, API

**규칙:**
- ✅ shared만 import 가능
- ❌ 다른 entities import 금지
- ❌ features 로직 금지
- 🎯 순수한 데이터와 표시만

---

### 🔷 **shared** (가장 하위)
**역할:** 재사용 가능한 공통 코드
```
shared/
├── ui/             # UI 컴포넌트 (Button, Input 등)
├── lib/            # 유틸리티 함수
├── api/            # API 클라이언트 설정
├── config/         # 상수, 환경변수
├── hooks/          # 공통 커스텀 훅
└── types/          # 공통 타입
```

**예시:**
- ui - Shadcn 컴포넌트 (Button, Card, Input)
- lib - formatDate, cn, clsx
- api - axios 인스턴스, base URL
- hooks - useLocalStorage, useDebounce

**규칙:**
- ✅ 비즈니스 로직 없음
- ✅ 다른 레이어 import 금지
- 🎯 어디서든 사용 가능한 순수 코드

## 🔗 의존성 규칙 (중요!)

### ✅ 허용되는 import:
```typescript
// pages는 모든 하위 레이어 import 가능
pages → widgets, features, entities, shared

// widgets는 features 아래만
widgets → features, entities, shared

// features는 entities 아래만
features → entities, shared

// entities는 shared만
entities → shared

// shared는 아무것도 import 안 함
shared → (nothing)
```

### ❌ 금지되는 import:
```typescript
// 상위 레이어 import 금지
shared → entities ❌
entities → features ❌
features → widgets ❌

// 같은 레이어 cross-import 금지
features/post-create → features/post-like ❌
entities/post → entities/user ❌
```

## 📂 세그먼트 구조

각 슬라이스 안의 표준 세그먼트:

```
feature/post-create/
├── ui/                    # UI 컴포넌트
│   ├── PostCreateForm.tsx
│   └── PostCreateButton.tsx
├── model/                 # 비즈니스 로직, 상태
│   ├── types.ts
│   ├── schema.ts
│   └── usePostCreate.ts
├── api/                   # API 호출
│   └── createPost.ts
├── lib/                   # 내부 유틸리티
│   └── validatePost.ts
└── index.ts               # Public API (중요!)
```

### Public API 패턴:
```typescript
// feature/post-create/index.ts
export { PostCreateForm } from './ui/PostCreateForm'
export { PostCreateButton } from './ui/PostCreateButton'
export { usePostCreate } from './model/usePostCreate'
export type { CreatePostData } from './model/types'

// ❌ 금지: 내부 구현 export 금지
// export { validateTitle } from './lib/validatePost'
```

**사용:**
```typescript
// pages/post-create/ui/PostCreatePage.tsx
import { PostCreateForm } from '@/features/post-create'  // ✅
// import { PostCreateForm } from '@/features/post-create/ui/PostCreateForm' // ❌
```

## 🏗️ 실제 구조 생성

### 생성할 폴더 구조:
```
src/
├── app/
│   ├── providers/
│   ├── router/
│   └── styles/
├── pages/
│   ├── home/
│   ├── post-detail/
│   └── post-create/
├── widgets/
│   ├── header/
│   ├── post-list/
│   └── sidebar/
├── features/
│   ├── auth/
│   ├── post-create/
│   ├── post-like/
│   └── comment-create/
├── entities/
│   ├── post/
│   ├── user/
│   └── comment/
└── shared/
    ├── ui/          # Shadcn 컴포넌트 이동
    ├── lib/
    ├── api/
    ├── config/
    ├── hooks/
    └── types/
```

## 🎓 블로그 프로젝트 예시

### 홈페이지 구성 예:
```
HomePage (pages/home)
├── Header (widgets/header)
│   ├── Logo (shared/ui)
│   ├── Navigation (shared/ui)
│   └── UserMenu (features/auth/logout)
├── PostList (widgets/post-list)
│   ├── PostCard (entities/post/ui)
│   ├── LikeButton (features/post-like)
│   └── Pagination (shared/ui)
└── Sidebar (widgets/sidebar)
    └── CategoryList (entities/category/ui)
```

## 📐 네이밍 컨벤션

### 슬라이스 이름:
- **kebab-case** 사용
- 명확하고 설명적인 이름
- 예: `post-create`, `comment-delete`, `user-profile`

### 파일 이름:
- **PascalCase** for components: `PostCard.tsx`
- **camelCase** for hooks: `usePost.ts`
- **camelCase** for utils: `formatDate.ts`

## ⚠️ 흔한 실수

### ❌ 잘못된 구조:
```
features/
└── blog/              # ❌ 너무 포괄적
    ├── CreatePost
    ├── EditPost
    └── DeletePost
```

### ✅ 올바른 구조:
```
features/
├── post-create/       # ✅ 하나의 기능
├── post-edit/         # ✅ 하나의 기능
└── post-delete/       # ✅ 하나의 기능
```

## 🎓 다음 단계 준비

이 단계를 완료하면:
- ✅ FSD 아키텍처 개념 이해
- ✅ 레이어별 역할과 책임 파악
- ✅ 의존성 규칙 숙지
- ✅ 폴더 구조 생성 준비

**다음 단계**: [5단계 - 절대 경로 import 설정](./step-05-path-alias.md)

## 📚 참고 자료
- [FSD 공식 문서](https://feature-sliced.design/)
- [FSD 예제](https://github.com/feature-sliced/examples)
- [의존성 규칙](https://feature-sliced.design/docs/reference/layers)
