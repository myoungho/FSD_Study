# 10단계: pages 레이어 구현 (HomePage, PostDetailPage)

## 📝 이 단계에서 배울 내용
- pages 레이어의 역할과 책임
- 라우트별 페이지 구성
- widgets, features, entities 조합
- 페이지별 레이아웃 구성

## 🎯 pages 레이어란?

**역할:** 라우트(URL)에 매핑되는 페이지 컴포넌트

### 특징:
- 🗺️ **라우팅** - 하나의 페이지 = 하나의 라우트
- 🧩 **조합** - widgets, features, entities를 레고처럼 조합
- 📐 **레이아웃** - 페이지별 레이아웃 구성
- 🚫 **비즈니스 로직 없음** - 단순히 조합만

### pages의 역할:
```
HomePage = Header + PostList + Sidebar
PostDetailPage = Header + PostContent + CommentSection
CreatePostPage = Header + CreatePostForm
```

## 📂 pages 구조

```
pages/
├── home/
│   ├── ui/
│   │   └── HomePage.tsx
│   └── index.ts
├── post-detail/
│   ├── ui/
│   │   └── PostDetailPage.tsx
│   ├── model/
│   │   └── usePostDetail.ts
│   └── index.ts
├── post-create/
│   ├── ui/
│   │   └── PostCreatePage.tsx
│   └── index.ts
└── not-found/
    ├── ui/
    │   └── NotFoundPage.tsx
    └── index.ts
```

## 🏗️ 1. HomePage 구현

### 1-1. HomePage 컴포넌트
```tsx
// pages/home/ui/HomePage.tsx
import { Header } from '@/widgets/header'
import { PostList } from '@/widgets/post-list'
import { Sidebar } from '@/widgets/sidebar'

export function HomePage() {
  // Mock user data (나중에 auth context에서 가져올 예정)
  const currentUser = {
    name: '김개발',
    avatar: 'https://i.pravatar.cc/150?img=1',
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header user={currentUser} />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container py-8">
          {/* Hero Section */}
          <section className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">
              FSD 블로그에 오신 것을 환영합니다
            </h1>
            <p className="text-xl text-muted-foreground">
              Feature-Sliced Design으로 구축한 모던 블로그 플랫폼
            </p>
          </section>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            {/* Posts */}
            <div>
              <h2 className="text-2xl font-bold mb-6">최근 포스트</h2>
              <PostList />
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-20">
                <Sidebar />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
```

### 1-2. Public API
```typescript
// pages/home/index.ts
export { HomePage } from './ui/HomePage'
```

## 🏗️ 2. PostDetailPage 구현

### 2-1. 비즈니스 로직
```typescript
// pages/post-detail/model/usePostDetail.ts
import { useState, useEffect } from 'react'
import { getPostById } from '@/entities/post'
import type { Post } from '@/entities/post'

export function usePostDetail(postId: string) {
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getPostById(postId)
        setPost(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '포스트를 불러올 수 없습니다')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  return { post, isLoading, error }
}
```

### 2-2. PostDetailPage 컴포넌트
```tsx
// pages/post-detail/ui/PostDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom'
import { Header } from '@/widgets/header'
import { CommentSection } from '@/widgets/comment-section'
import { LikeButton } from '@/features/post-like'
import { UserAvatar } from '@/entities/user'
import { Card, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { formatDate } from '@/shared/lib'
import { usePostDetail } from '../model/usePostDetail'

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { post, isLoading, error } = usePostDetail(id!)

  const currentUser = {
    name: '김개발',
    avatar: 'https://i.pravatar.cc/150?img=1',
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header user={currentUser} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">오류가 발생했습니다</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate('/')}>홈으로 돌아가기</Button>
          </div>
        </main>
      </div>
    )
  }

  if (isLoading || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header user={currentUser} />
        <main className="flex-1">
          <div className="container max-w-4xl py-8">
            <Skeleton className="h-[400px] mb-8" />
            <Skeleton className="h-12 mb-4" />
            <Skeleton className="h-64" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={currentUser} />

      <main className="flex-1">
        <article className="container max-w-4xl py-8">
          {/* Cover Image */}
          {post.coverImage && (
            <div className="aspect-video overflow-hidden rounded-lg mb-8">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Post Header */}
          <header className="mb-8">
            {/* Category & Date */}
            <div className="flex items-center gap-3 mb-4">
              <Badge>{post.category}</Badge>
              <time className="text-sm text-muted-foreground">
                {formatDate(post.publishedAt, 'long')}
              </time>
              {post.updatedAt > post.publishedAt && (
                <span className="text-sm text-muted-foreground">(수정됨)</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

            {/* Author & Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={post.author.name}
                  avatar={post.author.avatar}
                  size="md"
                />
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-sm text-muted-foreground">
                    조회 {post.viewsCount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <LikeButton
                  postId={post.id}
                  initialLikesCount={post.likesCount}
                  initialIsLiked={false}
                />
                <span className="text-sm text-muted-foreground">
                  💬 {post.commentsCount}
                </span>
              </div>
            </div>
          </header>

          {/* Post Content */}
          <Card className="mb-8">
            <CardContent className="prose prose-lg max-w-none pt-6">
              {/* 실제로는 마크다운 렌더러 사용 */}
              <div className="whitespace-pre-wrap">{post.content}</div>
            </CardContent>
          </Card>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Comment Section */}
          <CommentSection postId={post.id} />
        </article>
      </main>
    </div>
  )
}
```

### 2-3. Public API
```typescript
// pages/post-detail/index.ts
export { PostDetailPage } from './ui/PostDetailPage'
```

## 🏗️ 3. PostCreatePage 구현

```tsx
// pages/post-create/ui/PostCreatePage.tsx
import { Header } from '@/widgets/header'
import { CreatePostForm } from '@/features/post-create'

export function PostCreatePage() {
  const currentUser = {
    name: '김개발',
    avatar: 'https://i.pravatar.cc/150?img=1',
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={currentUser} />

      <main className="flex-1 bg-gray-50">
        <div className="container max-w-4xl py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">새 포스트 작성</h1>
            <p className="text-muted-foreground mt-2">
              당신의 생각을 공유해보세요
            </p>
          </div>

          <CreatePostForm />
        </div>
      </main>
    </div>
  )
}
```

```typescript
// pages/post-create/index.ts
export { PostCreatePage } from './ui/PostCreatePage'
```

## 🏗️ 4. NotFoundPage 구현

```tsx
// pages/not-found/ui/NotFoundPage.tsx
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Header } from '@/widgets/header'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-3xl font-bold mt-4 mb-2">페이지를 찾을 수 없습니다</h2>
          <p className="text-muted-foreground mb-8">
            요청하신 페이지가 존재하지 않거나 이동되었습니다.
          </p>

          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate(-1)} variant="outline">
              이전 페이지
            </Button>
            <Button onClick={() => navigate('/')}>
              홈으로 가기
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
```

```typescript
// pages/not-found/index.ts
export { NotFoundPage } from './ui/NotFoundPage'
```

## 🎓 pages 설계 원칙

### ✅ 해야 할 것:
1. **레이아웃 조합** - widgets를 조합하여 페이지 구성
2. **라우트 매핑** - 하나의 페이지 = 하나의 라우트
3. **데이터 페칭** - 페이지 레벨에서 데이터 로딩
4. **로딩/에러 처리** - 페이지 레벨에서 처리

### ❌ 하지 말아야 할 것:
1. **비즈니스 로직** - features에서 담당
2. **복잡한 컴포넌트** - widgets로 분리
3. **pages 간 import** - 금지!
4. **재사용** - pages는 재사용하지 않음

### 의존성 규칙:
```typescript
// ✅ 허용
pages → widgets, features, entities, shared

// ❌ 금지
pages → pages  // 다른 페이지
pages → app    // 상위 레이어
```

## 📐 페이지 레이아웃 패턴

### 1. 표준 레이아웃:
```tsx
<div className="min-h-screen flex flex-col">
  <Header />
  <main className="flex-1">
    {/* 페이지 내용 */}
  </main>
  <Footer />  {/* 선택사항 */}
</div>
```

### 2. 사이드바 레이아웃:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
  <div>{/* 메인 콘텐츠 */}</div>
  <aside>{/* 사이드바 */}</aside>
</div>
```

### 3. 센터 컨테이너:
```tsx
<div className="container max-w-4xl py-8">
  {/* 중앙 정렬 콘텐츠 */}
</div>
```

## 🧪 테스트 시나리오

### App.tsx에서 임시 라우팅:
```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import { PostDetailPage } from '@/pages/post-detail'
import { PostCreatePage } from '@/pages/post-create'
import { NotFoundPage } from '@/pages/not-found'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/posts/create" element={<PostCreatePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

## 📦 필요한 패키지

```bash
# 이미 설치되어 있어야 함
npm install react-router-dom
```

## 💡 페이지별 책임

### HomePage:
- ✅ PostList, Sidebar 배치
- ✅ Hero 섹션 표시
- ❌ 포스트 로직 (PostList가 담당)

### PostDetailPage:
- ✅ 포스트 데이터 페칭
- ✅ 레이아웃 구성
- ✅ 로딩/에러 처리
- ❌ 좋아요 로직 (LikeButton이 담당)
- ❌ 댓글 로직 (CommentSection이 담당)

### PostCreatePage:
- ✅ CreatePostForm 배치
- ✅ 페이지 제목 표시
- ❌ 작성 로직 (CreatePostForm이 담당)

## 🎓 다음 단계 준비

이 단계를 완료하면:
- ✅ 라우트별 페이지 구현
- ✅ widgets, features 효과적으로 조합
- ✅ 페이지 레벨 데이터 페칭
- ✅ app 레이어 구현 준비

**다음 단계**: [11단계 - app 레이어 구현](./step-11-app.md)

## 📚 참고 자료
- [FSD Pages](https://feature-sliced.design/docs/reference/layers#pages)
- [React Router](https://reactrouter.com/)
- [레이아웃 패턴](https://feature-sliced.design/docs/guides/examples/auth)
