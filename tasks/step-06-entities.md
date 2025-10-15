# 6단계: entities 레이어 구현 (Post, User, Comment)

## 📝 이 단계에서 배울 내용
- entities 레이어의 역할과 책임
- 비즈니스 엔티티 설계 (Post, User, Comment)
- 엔티티별 UI 컴포넌트 구현
- Public API 패턴 적용

## 🎯 entities 레이어란?

**역할:** 비즈니스 도메인의 핵심 데이터 모델

### 특징:
- 📦 **순수한 데이터** - 비즈니스 로직 없음
- 🎨 **표시 컴포넌트** - 데이터를 보여주기만 함
- 🔒 **독립적** - 다른 entities와 의존성 없음
- 📤 **재사용 가능** - 여러 features에서 사용

### entities vs features:
| entities | features |
|----------|----------|
| PostCard (표시만) | LikePost (좋아요 액션) |
| UserAvatar (표시만) | FollowUser (팔로우 액션) |
| CommentItem (표시만) | DeleteComment (삭제 액션) |

## 📂 entities 구조

```
entities/
├── post/
│   ├── ui/
│   │   ├── PostCard.tsx           # 포스트 카드
│   │   └── PostCardSkeleton.tsx   # 로딩 스켈레톤
│   ├── model/
│   │   ├── types.ts               # Post 타입
│   │   └── schema.ts              # Zod 스키마 (선택)
│   ├── api/
│   │   ├── getPosts.ts            # API 함수들
│   │   └── getPostById.ts
│   └── index.ts                   # Public API
├── user/
│   ├── ui/
│   │   ├── UserAvatar.tsx
│   │   └── UserCard.tsx
│   ├── model/
│   │   └── types.ts
│   ├── api/
│   │   └── getUser.ts
│   └── index.ts
└── comment/
    ├── ui/
    │   └── CommentItem.tsx
    ├── model/
    │   └── types.ts
    ├── api/
    │   └── getComments.ts
    └── index.ts
```

## 🏗️ 1. Post 엔티티 구현

### 1-1. 타입 정의
```typescript
// entities/post/model/types.ts
export interface Post {
  id: string
  title: string
  content: string
  excerpt: string        // 요약
  coverImage?: string    // 커버 이미지
  authorId: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  category: string
  tags: string[]
  publishedAt: Date
  updatedAt: Date
  likesCount: number
  commentsCount: number
  viewsCount: number
  isPublished: boolean
}

export interface PostPreview {
  id: string
  title: string
  excerpt: string
  coverImage?: string
  author: {
    name: string
    avatar?: string
  }
  category: string
  publishedAt: Date
  likesCount: number
  commentsCount: number
}
```

### 1-2. PostCard 컴포넌트
```tsx
// entities/post/ui/PostCard.tsx
import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Badge } from '@/shared/ui/badge'
import { formatDate } from '@/shared/lib/formatDate'
import { cn } from '@/shared/lib'
import type { PostPreview } from '../model/types'

interface PostCardProps {
  post: PostPreview
  className?: string
  onClick?: () => void
}

export function PostCard({ post, className, onClick }: PostCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg",
        className
      )}
      onClick={onClick}
    >
      {post.coverImage && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}

      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">{post.category}</Badge>
          <time className="text-sm text-muted-foreground">
            {formatDate(post.publishedAt)}
          </time>
        </div>

        <h3 className="text-2xl font-bold line-clamp-2 hover:text-primary">
          {post.title}
        </h3>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>
                {post.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">
              {post.author.name}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>❤️ {post.likesCount}</span>
            <span>💬 {post.commentsCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### 1-3. PostCardSkeleton (로딩 UI)
```tsx
// entities/post/ui/PostCardSkeleton.tsx
import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'

export function PostCardSkeleton() {
  return (
    <Card>
      <Skeleton className="aspect-video rounded-t-lg" />

      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-3/4" />
      </CardHeader>

      <CardContent>
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### 1-4. API 함수들
```typescript
// entities/post/api/getPosts.ts
import type { Post, PostPreview } from '../model/types'

// 나중에 실제 API로 교체
export async function getPosts(): Promise<PostPreview[]> {
  // Mock data
  return [
    {
      id: '1',
      title: 'FSD 아키텍처 완벽 가이드',
      excerpt: 'Feature-Sliced Design을 실전 프로젝트에 적용하는 방법을 알아봅니다.',
      coverImage: 'https://picsum.photos/800/400?random=1',
      author: {
        name: '김개발',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
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
      author: {
        name: '이프론트',
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
      category: 'React',
      publishedAt: new Date('2024-01-20'),
      likesCount: 89,
      commentsCount: 23,
    },
  ]
}

// entities/post/api/getPostById.ts
export async function getPostById(id: string): Promise<Post> {
  // Mock data
  return {
    id,
    title: 'FSD 아키텍처 완벽 가이드',
    content: '# FSD 소개\n\n실전 예제로 배우는...',
    excerpt: 'Feature-Sliced Design을 실전 프로젝트에 적용하는 방법을 알아봅니다.',
    coverImage: 'https://picsum.photos/800/400?random=1',
    authorId: '1',
    author: {
      id: '1',
      name: '김개발',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    category: 'Architecture',
    tags: ['FSD', 'Architecture', 'React'],
    publishedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    likesCount: 42,
    commentsCount: 12,
    viewsCount: 532,
    isPublished: true,
  }
}
```

### 1-5. Public API
```typescript
// entities/post/index.ts
export { PostCard } from './ui/PostCard'
export { PostCardSkeleton } from './ui/PostCardSkeleton'
export type { Post, PostPreview } from './model/types'
export { getPosts, getPostById } from './api'
```

## 🏗️ 2. User 엔티티 구현

### 2-1. 타입 정의
```typescript
// entities/user/model/types.ts
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  role: 'admin' | 'author' | 'reader'
  createdAt: Date
  postsCount: number
  followersCount: number
  followingCount: number
}
```

### 2-2. UserAvatar 컴포넌트
```tsx
// entities/user/ui/UserAvatar.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { cn } from '@/shared/lib'

interface UserAvatarProps {
  name: string
  avatar?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function UserAvatar({
  name,
  avatar,
  size = 'md',
  className
}: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  }

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={avatar} alt={name} />
      <AvatarFallback>
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}
```

### 2-3. UserCard 컴포넌트
```tsx
// entities/user/ui/UserCard.tsx
import { Card, CardContent } from '@/shared/ui/card'
import { UserAvatar } from './UserAvatar'
import type { User } from '../model/types'

interface UserCardProps {
  user: User
  onClick?: () => void
}

export function UserCard({ user, onClick }: UserCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <UserAvatar name={user.name} avatar={user.avatar} size="lg" />

          <div className="flex-1">
            <h3 className="font-semibold text-lg">{user.name}</h3>
            {user.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {user.bio}
              </p>
            )}

            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <span>{user.postsCount} posts</span>
              <span>{user.followersCount} followers</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### 2-4. Public API
```typescript
// entities/user/index.ts
export { UserAvatar } from './ui/UserAvatar'
export { UserCard } from './ui/UserCard'
export type { User } from './model/types'
```

## 🏗️ 3. Comment 엔티티 구현

### 3-1. 타입 정의
```typescript
// entities/comment/model/types.ts
export interface Comment {
  id: string
  postId: string
  authorId: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  content: string
  createdAt: Date
  updatedAt: Date
  likesCount: number
  isEdited: boolean
}
```

### 3-2. CommentItem 컴포넌트
```tsx
// entities/comment/ui/CommentItem.tsx
import { Card, CardContent } from '@/shared/ui/card'
import { UserAvatar } from '@/entities/user'
import { formatDate } from '@/shared/lib/formatDate'
import type { Comment } from '../model/types'

interface CommentItemProps {
  comment: Comment
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex gap-3">
          <UserAvatar
            name={comment.author.name}
            avatar={comment.author.avatar}
            size="sm"
          />

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">
                {comment.author.name}
              </span>
              <time className="text-xs text-muted-foreground">
                {formatDate(comment.createdAt)}
              </time>
              {comment.isEdited && (
                <span className="text-xs text-muted-foreground">
                  (edited)
                </span>
              )}
            </div>

            <p className="text-sm">{comment.content}</p>

            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
              <button className="hover:text-foreground">
                ❤️ {comment.likesCount}
              </button>
              <button className="hover:text-foreground">
                Reply
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### 3-3. Public API
```typescript
// entities/comment/index.ts
export { CommentItem } from './ui/CommentItem'
export type { Comment } from './model/types'
```

## 🧪 테스트하기

### App.tsx에서 테스트:
```tsx
// src/App.tsx
import { PostCard, PostCardSkeleton } from '@/entities/post'
import { UserCard } from '@/entities/user'
import { CommentItem } from '@/entities/comment'

function App() {
  const mockPost = {
    id: '1',
    title: 'FSD 아키텍처 완벽 가이드',
    excerpt: 'Feature-Sliced Design을 실전 프로젝트에 적용하는 방법',
    coverImage: 'https://picsum.photos/800/400?random=1',
    author: {
      name: '김개발',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    category: 'Architecture',
    publishedAt: new Date(),
    likesCount: 42,
    commentsCount: 12,
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Entities 테스트</h1>

        <section>
          <h2 className="text-xl font-semibold mb-4">PostCard</h2>
          <PostCard post={mockPost} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Loading State</h2>
          <PostCardSkeleton />
        </section>
      </div>
    </div>
  )
}

export default App
```

## 📋 필요한 Shadcn 컴포넌트 설치

```bash
npx shadcn@latest add card
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add skeleton
```

## 🎓 entities 설계 원칙

### ✅ 해야 할 것:
1. **순수한 표시** - 데이터를 보여주기만
2. **재사용 가능** - 여러 곳에서 사용 가능하게
3. **독립적** - 다른 entities 의존성 없음
4. **타입 안전** - TypeScript 타입 정의

### ❌ 하지 말아야 할 것:
1. **비즈니스 로직** - "좋아요", "삭제" 등의 액션
2. **API 호출** - features에서 담당
3. **상태 관리** - features나 widgets에서
4. **복잡한 조합** - widgets에서 담당

## 🎓 다음 단계 준비

이 단계를 완료하면:
- ✅ Post, User, Comment 엔티티 구현
- ✅ 재사용 가능한 UI 컴포넌트
- ✅ Public API 패턴 적용
- ✅ features 레이어 구현 준비

**다음 단계**: [7단계 - shared 레이어 구현](./step-07-shared.md)

## 📚 참고 자료
- [FSD Entities](https://feature-sliced.design/docs/reference/layers#entities)
- [Public API 패턴](https://feature-sliced.design/docs/reference/public-api)
