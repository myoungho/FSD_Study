# 8단계: features 레이어 구현 (블로그 기능들)

## 📝 이 단계에서 배울 내용
- features 레이어의 핵심 역할
- 사용자 기능(feature) 단위로 코드 분리
- 비즈니스 로직과 UI 통합
- Public API 패턴으로 캡슐화

## 🎯 features 레이어란?

**역할:** 사용자 시나리오/비즈니스 기능의 구현

### 특징:
- 🎬 **사용자 액션** - 하나의 기능 = 하나의 feature
- 🔄 **비즈니스 로직** - 상태 관리, API 호출, 검증
- 🎨 **기능별 UI** - 해당 기능의 UI 컴포넌트
- 🔒 **캡슐화** - 내부 구현 숨김, Public API만 노출

### entities vs features:
| entities | features |
|----------|----------|
| PostCard (표시) | CreatePost (작성 기능) |
| UserAvatar (표시) | FollowUser (팔로우 기능) |
| CommentItem (표시) | DeleteComment (삭제 기능) |

## 📂 features 구조

```
features/
├── auth/
│   ├── login/
│   │   ├── ui/
│   │   │   └── LoginForm.tsx
│   │   ├── model/
│   │   │   ├── useLogin.ts
│   │   │   └── types.ts
│   │   ├── api/
│   │   │   └── login.ts
│   │   └── index.ts
│   └── logout/
│       ├── ui/
│       │   └── LogoutButton.tsx
│       └── index.ts
├── post-create/
│   ├── ui/
│   │   ├── CreatePostForm.tsx
│   │   └── CreatePostButton.tsx
│   ├── model/
│   │   ├── useCreatePost.ts
│   │   ├── schema.ts
│   │   └── types.ts
│   ├── api/
│   │   └── createPost.ts
│   └── index.ts
├── post-edit/
├── post-like/
│   ├── ui/
│   │   └── LikeButton.tsx
│   ├── model/
│   │   └── useLikePost.ts
│   ├── api/
│   │   └── toggleLike.ts
│   └── index.ts
├── comment-create/
└── comment-delete/
```

## 🏗️ 1. post-like 기능 구현

### 1-1. 타입 및 API
```typescript
// features/post-like/model/types.ts
export interface LikeState {
  isLiked: boolean
  likesCount: number
}
```

```typescript
// features/post-like/api/toggleLike.ts
import { apiClient } from '@/shared/api'

export async function toggleLike(postId: string): Promise<LikeState> {
  // Mock implementation
  const response = await new Promise<LikeState>((resolve) => {
    setTimeout(() => {
      const isLiked = Math.random() > 0.5
      resolve({
        isLiked,
        likesCount: Math.floor(Math.random() * 100),
      })
    }, 500)
  })

  return response

  // 실제 API 호출:
  // const { data } = await apiClient.post<ApiResponse<LikeState>>(`/posts/${postId}/like`)
  // return data.data
}
```

### 1-2. 비즈니스 로직 (Hook)
```typescript
// features/post-like/model/useLikePost.ts
import { useState } from 'react'
import { toggleLike } from '../api/toggleLike'
import type { LikeState } from './types'

export function useLikePost(postId: string, initialState: LikeState) {
  const [state, setState] = useState<LikeState>(initialState)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleLike = async () => {
    setIsLoading(true)

    // Optimistic update
    const previousState = { ...state }
    setState({
      isLiked: !state.isLiked,
      likesCount: state.isLiked ? state.likesCount - 1 : state.likesCount + 1,
    })

    try {
      const newState = await toggleLike(postId)
      setState(newState)
    } catch (error) {
      // Rollback on error
      setState(previousState)
      console.error('Failed to toggle like:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLiked: state.isLiked,
    likesCount: state.likesCount,
    isLoading,
    toggleLike: handleToggleLike,
  }
}
```

### 1-3. UI 컴포넌트
```tsx
// features/post-like/ui/LikeButton.tsx
import { Button } from '@/shared/ui/button'
import { formatNumber } from '@/shared/lib'
import { useLikePost } from '../model/useLikePost'
import { cn } from '@/shared/lib'

interface LikeButtonProps {
  postId: string
  initialLikesCount: number
  initialIsLiked: boolean
  className?: string
}

export function LikeButton({
  postId,
  initialLikesCount,
  initialIsLiked,
  className,
}: LikeButtonProps) {
  const { isLiked, likesCount, isLoading, toggleLike } = useLikePost(postId, {
    isLiked: initialIsLiked,
    likesCount: initialLikesCount,
  })

  return (
    <Button
      variant={isLiked ? 'default' : 'outline'}
      size="sm"
      onClick={toggleLike}
      disabled={isLoading}
      className={cn('gap-2', className)}
    >
      <span className={cn(isLiked && 'scale-125 transition-transform')}>
        {isLiked ? '❤️' : '🤍'}
      </span>
      <span>{formatNumber(likesCount)}</span>
    </Button>
  )
}
```

### 1-4. Public API
```typescript
// features/post-like/index.ts
export { LikeButton } from './ui/LikeButton'
export { useLikePost } from './model/useLikePost'
export type { LikeState } from './model/types'
```

## 🏗️ 2. post-create 기능 구현

### 2-1. 타입 및 스키마
```typescript
// features/post-create/model/types.ts
export interface CreatePostData {
  title: string
  content: string
  excerpt: string
  coverImage?: string
  category: string
  tags: string[]
  isPublished: boolean
}

export interface CreatePostFormData {
  title: string
  content: string
  category: string
  tags: string
  isPublished: boolean
}
```

```typescript
// features/post-create/model/schema.ts
import { z } from 'zod'
import { VALIDATION } from '@/shared/config'

export const createPostSchema = z.object({
  title: z
    .string()
    .min(VALIDATION.POST_TITLE_MIN_LENGTH, '제목은 최소 5자 이상이어야 합니다')
    .max(VALIDATION.POST_TITLE_MAX_LENGTH, '제목은 최대 100자까지 가능합니다'),
  content: z
    .string()
    .min(VALIDATION.POST_CONTENT_MIN_LENGTH, '내용은 최소 100자 이상이어야 합니다'),
  category: z.string().min(1, '카테고리를 선택해주세요'),
  tags: z.string(),
  isPublished: z.boolean().default(false),
})
```

### 2-2. API
```typescript
// features/post-create/api/createPost.ts
import { apiClient } from '@/shared/api'
import type { Post } from '@/entities/post'
import type { CreatePostData } from '../model/types'

export async function createPost(data: CreatePostData): Promise<Post> {
  // Mock implementation
  const response = await new Promise<Post>((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        excerpt: data.content.substring(0, 150),
        authorId: '1',
        author: {
          id: '1',
          name: '현재 사용자',
          avatar: 'https://i.pravatar.cc/150?img=1',
        },
        publishedAt: new Date(),
        updatedAt: new Date(),
        likesCount: 0,
        commentsCount: 0,
        viewsCount: 0,
      })
    }, 1000)
  })

  return response

  // 실제 API:
  // const { data } = await apiClient.post<ApiResponse<Post>>('/posts', data)
  // return data.data
}
```

### 2-3. 비즈니스 로직
```typescript
// features/post-create/model/useCreatePost.ts
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../api/createPost'
import type { CreatePostData } from './types'

export function useCreatePost() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const create = async (data: CreatePostData) => {
    setIsLoading(true)
    setError(null)

    try {
      const post = await createPost(data)
      navigate(`/posts/${post.id}`)
      return post
    } catch (err) {
      const message = err instanceof Error ? err.message : '포스트 작성에 실패했습니다'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    create,
    isLoading,
    error,
  }
}
```

### 2-4. UI 컴포넌트
```tsx
// features/post-create/ui/CreatePostForm.tsx
import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { CATEGORIES } from '@/shared/config'
import { useCreatePost } from '../model/useCreatePost'
import type { CreatePostFormData } from '../model/types'

export function CreatePostForm() {
  const { create, isLoading, error } = useCreatePost()
  const [formData, setFormData] = useState<CreatePostFormData>({
    title: '',
    content: '',
    category: '',
    tags: '',
    isPublished: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await create({
      ...formData,
      excerpt: formData.content.substring(0, 150),
      tags: formData.tags.split(',').map((tag) => tag.trim()),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>새 포스트 작성</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">제목</label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="포스트 제목을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">카테고리</label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">내용</label>
            <Textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="포스트 내용을 작성하세요"
              rows={10}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">태그 (쉼표로 구분)</label>
            <Input
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="React, TypeScript, FSD"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '작성 중...' : '포스트 작성'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setFormData({ ...formData, isPublished: !formData.isPublished })
              }
            >
              {formData.isPublished ? '초안으로 저장' : '바로 발행'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
```

### 2-5. Public API
```typescript
// features/post-create/index.ts
export { CreatePostForm } from './ui/CreatePostForm'
export { useCreatePost } from './model/useCreatePost'
export type { CreatePostData, CreatePostFormData } from './model/types'
```

## 🏗️ 3. comment-create 기능 구현

### 3-1. 타입 및 API
```typescript
// features/comment-create/model/types.ts
export interface CreateCommentData {
  postId: string
  content: string
}
```

```typescript
// features/comment-create/api/createComment.ts
import type { Comment } from '@/entities/comment'
import type { CreateCommentData } from '../model/types'

export async function createComment(data: CreateCommentData): Promise<Comment> {
  // Mock
  return {
    id: Math.random().toString(36).substr(2, 9),
    postId: data.postId,
    authorId: '1',
    author: {
      id: '1',
      name: '현재 사용자',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    content: data.content,
    createdAt: new Date(),
    updatedAt: new Date(),
    likesCount: 0,
    isEdited: false,
  }
}
```

### 3-2. Hook 및 UI
```typescript
// features/comment-create/model/useCreateComment.ts
import { useState } from 'react'
import { createComment } from '../api/createComment'
import type { CreateCommentData } from './types'

export function useCreateComment(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false)

  const create = async (data: CreateCommentData) => {
    setIsLoading(true)
    try {
      const comment = await createComment(data)
      onSuccess?.()
      return comment
    } finally {
      setIsLoading(false)
    }
  }

  return { create, isLoading }
}
```

```tsx
// features/comment-create/ui/CommentCreateForm.tsx
import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { useCreateComment } from '../model/useCreateComment'

interface CommentCreateFormProps {
  postId: string
  onSuccess?: () => void
}

export function CommentCreateForm({ postId, onSuccess }: CommentCreateFormProps) {
  const [content, setContent] = useState('')
  const { create, isLoading } = useCreateComment(onSuccess)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    await create({ postId, content })
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 작성하세요..."
        rows={3}
      />
      <Button type="submit" disabled={isLoading || !content.trim()}>
        {isLoading ? '작성 중...' : '댓글 작성'}
      </Button>
    </form>
  )
}
```

### 3-3. Public API
```typescript
// features/comment-create/index.ts
export { CommentCreateForm } from './ui/CommentCreateForm'
export { useCreateComment } from './model/useCreateComment'
```

## 📦 필요한 패키지

```bash
# 폼 검증
npm install zod

# 라우팅 (다음 단계에서 사용)
npm install react-router-dom

# Shadcn 컴포넌트
npx shadcn@latest add textarea
npx shadcn@latest add select
```

## 🎓 features 설계 원칙

### ✅ 하나의 feature = 하나의 사용자 액션:
- `post-create` - 포스트 작성
- `post-edit` - 포스트 수정
- `post-like` - 포스트 좋아요
- `comment-create` - 댓글 작성

### ❌ 잘못된 예:
```
features/
└── blog/           # ❌ 너무 넓음
    ├── CreatePost
    ├── EditPost
    └── DeletePost
```

### features 간 통신 금지:
```typescript
// ❌ 금지
import { LikeButton } from '@/features/post-like'

// features/comment-like에서
// features/post-like를 직접 import하면 안 됨!
```

### 통신이 필요하면:
1. **widgets에서 조합**
2. **pages에서 조합**
3. **공통 로직은 shared로**

## 🎓 다음 단계 준비

이 단계를 완료하면:
- ✅ 사용자 기능별로 코드 분리
- ✅ 비즈니스 로직 캡슐화
- ✅ 재사용 가능한 기능 모듈
- ✅ widgets 레이어 구현 준비

**다음 단계**: [9단계 - widgets 레이어 구현](./step-09-widgets.md)

## 📚 참고 자료
- [FSD Features](https://feature-sliced.design/docs/reference/layers#features)
- [Zod Validation](https://zod.dev/)
