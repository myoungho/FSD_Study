# 9단계: widgets 레이어 구현 (PostList, Header 등)

## 📝 이 단계에서 배울 내용
- widgets 레이어의 역할과 특징
- 여러 features와 entities 조합
- 독립적인 복합 UI 블록 구현
- 위젯 간 의존성 관리

## 🎯 widgets 레이어란?

**역할:** 독립적으로 작동하는 복합 UI 블록

### 특징:
- 🧩 **조합** - features + entities + shared를 조합
- 🔲 **독립성** - 다른 widgets와 독립적
- ♻️ **재사용** - 여러 페이지에서 사용 가능
- 🎨 **완성형 블록** - 바로 사용 가능한 UI

### widgets vs features:
| features | widgets |
|----------|---------|
| LikeButton (단일 기능) | PostList (여러 기능 조합) |
| CreatePostForm (폼만) | Header (nav + user menu + search) |
| CommentCreate (댓글 작성) | CommentSection (목록 + 작성) |

## 📂 widgets 구조

```
widgets/
├── header/
│   ├── ui/
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   └── UserMenu.tsx
│   ├── model/
│   │   └── useHeader.ts
│   └── index.ts
├── post-list/
│   ├── ui/
│   │   ├── PostList.tsx
│   │   ├── PostListItem.tsx
│   │   └── PostListSkeleton.tsx
│   ├── model/
│   │   ├── usePostList.ts
│   │   └── types.ts
│   ├── api/
│   │   └── getPostList.ts
│   └── index.ts
├── sidebar/
│   ├── ui/
│   │   └── Sidebar.tsx
│   └── index.ts
└── comment-section/
    ├── ui/
    │   └── CommentSection.tsx
    └── index.ts
```

## 🏗️ 1. Header 위젯 구현

### 1-1. Navigation 컴포넌트
```tsx
// widgets/header/ui/Navigation.tsx
import { Link } from 'react-router-dom'
import { cn } from '@/shared/lib'

const navItems = [
  { label: '홈', href: '/' },
  { label: '포스트', href: '/posts' },
  { label: '카테고리', href: '/categories' },
  { label: '소개', href: '/about' },
]

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  return (
    <nav className={cn('flex gap-6', className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
```

### 1-2. UserMenu 컴포넌트
```tsx
// widgets/header/ui/UserMenu.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { UserAvatar } from '@/entities/user'
import { Button } from '@/shared/ui/button'

interface UserMenuProps {
  user?: {
    name: string
    avatar?: string
  }
  onLogout?: () => void
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" asChild>
          <a href="/login">로그인</a>
        </Button>
        <Button size="sm" asChild>
          <a href="/signup">회원가입</a>
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
          <UserAvatar name={user.name} avatar={user.avatar} size="sm" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">내 프로필</p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <a href="/profile">프로필</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/posts/create">포스트 작성</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/settings">설정</a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onLogout} className="text-destructive">
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### 1-3. Header 메인 컴포넌트
```tsx
// widgets/header/ui/Header.tsx
import { Link } from 'react-router-dom'
import { Navigation } from './Navigation'
import { UserMenu } from './UserMenu'
import { Button } from '@/shared/ui/button'
import { APP_NAME } from '@/shared/config'
import { useIsMobile } from '@/shared/hooks'

interface HeaderProps {
  user?: {
    name: string
    avatar?: string
  }
  onLogout?: () => void
}

export function Header({ user, onLogout }: HeaderProps) {
  const isMobile = useIsMobile()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            F
          </div>
          {!isMobile && (
            <span className="text-xl font-bold">{APP_NAME}</span>
          )}
        </Link>

        {/* Navigation */}
        {!isMobile && <Navigation />}

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {user && (
            <Button size="sm" asChild>
              <Link to="/posts/create">글쓰기</Link>
            </Button>
          )}
          <UserMenu user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  )
}
```

### 1-4. Public API
```typescript
// widgets/header/index.ts
export { Header } from './ui/Header'
```

## 🏗️ 2. PostList 위젯 구현

### 2-1. 타입 및 API
```typescript
// widgets/post-list/model/types.ts
import type { PostPreview } from '@/entities/post'
import type { PaginatedResponse } from '@/shared/api'

export interface PostListFilters {
  category?: string
  tag?: string
  search?: string
}

export type PostListData = PaginatedResponse<PostPreview>
```

```typescript
// widgets/post-list/api/getPostList.ts
import type { PostListData, PostListFilters } from '../model/types'

export async function getPostList(
  page: number = 1,
  filters?: PostListFilters
): Promise<PostListData> {
  // Mock data
  const mockPosts = [
    {
      id: '1',
      title: 'FSD 아키텍처 완벽 가이드',
      excerpt: 'Feature-Sliced Design을 실전 프로젝트에 적용하는 방법을 알아봅니다.',
      coverImage: 'https://picsum.photos/800/400?random=1',
      author: { name: '김개발', avatar: 'https://i.pravatar.cc/150?img=1' },
      category: 'Architecture',
      publishedAt: new Date('2024-01-15'),
      likesCount: 42,
      commentsCount: 12,
    },
    {
      id: '2',
      title: 'React 19의 새로운 기능들',
      excerpt: 'React 19에서 추가된 신기능과 변경사항을 살펴봅니다.',
      coverImage: 'https://picsum.photos/800/400?random=2',
      author: { name: '이프론트', avatar: 'https://i.pravatar.cc/150?img=2' },
      category: 'React',
      publishedAt: new Date('2024-01-20'),
      likesCount: 89,
      commentsCount: 23,
    },
    {
      id: '3',
      title: 'TypeScript 5.0 새 기능',
      excerpt: 'TypeScript 5.0의 주요 변경사항과 새로운 기능들을 정리했습니다.',
      coverImage: 'https://picsum.photos/800/400?random=3',
      author: { name: '박타입', avatar: 'https://i.pravatar.cc/150?img=3' },
      category: 'TypeScript',
      publishedAt: new Date('2024-01-25'),
      likesCount: 67,
      commentsCount: 15,
    },
  ]

  return {
    data: mockPosts,
    pagination: {
      page,
      pageSize: 10,
      total: 30,
      totalPages: 3,
    },
  }
}
```

### 2-2. 비즈니스 로직
```typescript
// widgets/post-list/model/usePostList.ts
import { useState, useEffect } from 'react'
import { getPostList } from '../api/getPostList'
import type { PostListData, PostListFilters } from './types'

export function usePostList(initialPage: number = 1) {
  const [data, setData] = useState<PostListData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(initialPage)
  const [filters, setFilters] = useState<PostListFilters>({})

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await getPostList(page, filters)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : '포스트를 불러오지 못했습니다')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [page, filters])

  return {
    posts: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    error,
    page,
    setPage,
    filters,
    setFilters,
  }
}
```

### 2-3. UI 컴포넌트
```tsx
// widgets/post-list/ui/PostList.tsx
import { useNavigate } from 'react-router-dom'
import { PostCard, PostCardSkeleton } from '@/entities/post'
import { LikeButton } from '@/features/post-like'
import { Button } from '@/shared/ui/button'
import { usePostList } from '../model/usePostList'

export function PostList() {
  const navigate = useNavigate()
  const { posts, pagination, isLoading, error, page, setPage } = usePostList()

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          다시 시도
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Post Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div key={post.id} className="relative">
            <PostCard
              post={post}
              onClick={() => navigate(`/posts/${post.id}`)}
            />

            {/* Like Button Overlay */}
            <div className="absolute bottom-4 right-4">
              <LikeButton
                postId={post.id}
                initialLikesCount={post.likesCount}
                initialIsLiked={false}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            이전
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? 'default' : 'outline'}
                  onClick={() => setPage(pageNum)}
                  size="sm"
                >
                  {pageNum}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.totalPages}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  )
}
```

### 2-4. Public API
```typescript
// widgets/post-list/index.ts
export { PostList } from './ui/PostList'
export { usePostList } from './model/usePostList'
```

## 🏗️ 3. CommentSection 위젯 구현

```tsx
// widgets/comment-section/ui/CommentSection.tsx
import { useState, useEffect } from 'react'
import { CommentItem } from '@/entities/comment'
import { CommentCreateForm } from '@/features/comment-create'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import type { Comment } from '@/entities/comment'

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data
    setTimeout(() => {
      setComments([
        {
          id: '1',
          postId,
          authorId: '1',
          author: {
            id: '1',
            name: '김댓글',
            avatar: 'https://i.pravatar.cc/150?img=4',
          },
          content: '정말 유익한 글이네요! 감사합니다.',
          createdAt: new Date('2024-01-20T10:30:00'),
          updatedAt: new Date('2024-01-20T10:30:00'),
          likesCount: 5,
          isEdited: false,
        },
        {
          id: '2',
          postId,
          authorId: '2',
          author: {
            id: '2',
            name: '이리뷰',
            avatar: 'https://i.pravatar.cc/150?img=5',
          },
          content: 'FSD 아키텍처 도입 후 프로젝트 구조가 정말 깔끔해졌어요.',
          createdAt: new Date('2024-01-20T14:15:00'),
          updatedAt: new Date('2024-01-20T14:15:00'),
          likesCount: 3,
          isEdited: false,
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [postId])

  const handleCommentCreated = () => {
    // Refresh comments
    console.log('Comment created, refreshing...')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>댓글 {comments.length}개</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Comment Form */}
        <CommentCreateForm postId={postId} onSuccess={handleCommentCreated} />

        {/* Comments List */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              첫 번째 댓글을 작성해보세요!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

```typescript
// widgets/comment-section/index.ts
export { CommentSection } from './ui/CommentSection'
```

## 🏗️ 4. Sidebar 위젯 구현

```tsx
// widgets/sidebar/ui/Sidebar.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { CATEGORIES } from '@/shared/config'

export function Sidebar() {
  const popularTags = ['React', 'TypeScript', 'FSD', 'Tailwind', 'Vite']

  return (
    <aside className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">카테고리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {CATEGORIES.map((category) => (
              <a
                key={category}
                href={`/categories/${category}`}
                className="text-sm hover:text-primary transition-colors"
              >
                {category}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">인기 태그</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">소개</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            FSD 아키텍처로 구축한 모던 블로그 플랫폼입니다.
          </p>
        </CardContent>
      </Card>
    </aside>
  )
}
```

```typescript
// widgets/sidebar/index.ts
export { Sidebar } from './ui/Sidebar'
```

## 📦 필요한 Shadcn 컴포넌트

```bash
npx shadcn@latest add dropdown-menu
```

## 🎓 widgets 설계 원칙

### ✅ 해야 할 것:
1. **조합** - features + entities 조합
2. **독립성** - 다른 widgets와 독립적
3. **완성형** - 바로 사용 가능한 UI 블록
4. **재사용** - 여러 페이지에서 사용

### ❌ 하지 말아야 할 것:
1. **widgets 간 import** - 금지!
2. **pages import** - 상위 레이어
3. **너무 복잡** - 단순하게 유지
4. **비즈니스 로직** - features에서

### 의존성 규칙:
```typescript
// ✅ 허용
widgets → features, entities, shared

// ❌ 금지
widgets → widgets  // 다른 위젯
widgets → pages    // 상위 레이어
```

## 🎓 다음 단계 준비

이 단계를 완료하면:
- ✅ 독립적인 복합 UI 블록 구현
- ✅ features와 entities 효과적으로 조합
- ✅ 재사용 가능한 위젯 라이브러리
- ✅ pages 레이어 구현 준비

**다음 단계**: [10단계 - pages 레이어 구현](./step-10-pages.md)

## 📚 참고 자료
- [FSD Widgets](https://feature-sliced.design/docs/reference/layers#widgets)
- [컴포지션 패턴](https://feature-sliced.design/docs/guides/tech/with-react)
