# 7단계: shared 레이어 구현 (UI 컴포넌트, utils)

## 📝 이 단계에서 배울 내용
- shared 레이어의 역할과 중요성
- UI 컴포넌트 라이브러리 구성
- 공통 유틸리티 함수 작성
- API 클라이언트 설정

## 🎯 shared 레이어란?

**역할:** 프로젝트 전체에서 재사용 가능한 코드

### 특징:
- 🔧 **비즈니스 로직 없음** - 순수 유틸리티
- 🎨 **UI 기본 블록** - 원자적 컴포넌트
- 📦 **독립적** - 다른 레이어 의존성 없음
- ♻️ **재사용성** - 어디서든 사용 가능

### shared에 포함되는 것:
- ✅ Button, Input 등 기본 UI
- ✅ formatDate, cn 등 헬퍼 함수
- ✅ API 클라이언트, axios 인스턴스
- ✅ 상수, 환경 변수
- ✅ 공통 커스텀 훅
- ✅ 공통 타입

### shared에 포함되지 않는 것:
- ❌ PostCard (entities/post에 속함)
- ❌ CreatePostForm (features에 속함)
- ❌ 비즈니스 로직
- ❌ 도메인 특화 코드

## 📂 shared 구조

```
shared/
├── ui/                    # Shadcn UI 컴포넌트
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── skeleton.tsx
│   └── index.ts
├── lib/                   # 유틸리티 함수
│   ├── utils.ts          # cn 함수
│   ├── formatDate.ts
│   ├── formatNumber.ts
│   └── index.ts
├── api/                   # API 클라이언트
│   ├── client.ts         # axios 인스턴스
│   ├── types.ts          # API 공통 타입
│   └── index.ts
├── config/                # 설정, 상수
│   ├── constants.ts
│   ├── env.ts
│   └── index.ts
├── hooks/                 # 공통 커스텀 훅
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   ├── useMediaQuery.ts
│   └── index.ts
└── types/                 # 공통 타입
    ├── common.ts
    └── index.ts
```

## 🏗️ 1. shared/lib 구현

### 1-1. formatDate 유틸리티
```typescript
// shared/lib/formatDate.ts
export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date

  if (format === 'short') {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d)
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  const intervals = {
    년: 31536000,
    개월: 2592000,
    주: 604800,
    일: 86400,
    시간: 3600,
    분: 60,
  }

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds)
    if (interval >= 1) {
      return `${interval}${unit} 전`
    }
  }

  return '방금 전'
}
```

### 1-2. formatNumber 유틸리티
```typescript
// shared/lib/formatNumber.ts
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

export function formatCurrency(amount: number, currency = 'KRW'): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
  }).format(amount)
}
```

### 1-3. string 유틸리티
```typescript
// shared/lib/string.ts
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
```

### 1-4. Public API
```typescript
// shared/lib/index.ts
export { cn } from './utils'
export { formatDate, formatRelativeTime } from './formatDate'
export { formatNumber, formatCurrency } from './formatNumber'
export { truncate, slugify } from './string'
```

## 🏗️ 2. shared/api 구현

### 2-1. API 클라이언트 설정
```typescript
// shared/api/client.ts
import axios, { type AxiosInstance, type AxiosError } from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // 토큰이 있으면 헤더에 추가
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // 에러 처리
    if (error.response?.status === 401) {
      // 인증 실패 - 로그인 페이지로 리다이렉트
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)
```

### 2-2. API 공통 타입
```typescript
// shared/api/types.ts
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
  code: string
  details?: unknown
}
```

### 2-3. Public API
```typescript
// shared/api/index.ts
export { apiClient } from './client'
export type { ApiResponse, PaginatedResponse, ApiError } from './types'
```

## 🏗️ 3. shared/config 구현

### 3-1. 환경 변수
```typescript
// shared/config/env.ts
export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
```

### 3-2. 상수
```typescript
// shared/config/constants.ts
export const APP_NAME = 'FSD Blog'

export const ROUTES = {
  HOME: '/',
  POST_DETAIL: '/posts/:id',
  POST_CREATE: '/posts/create',
  POST_EDIT: '/posts/:id/edit',
  PROFILE: '/profile/:id',
  LOGIN: '/login',
  SIGNUP: '/signup',
} as const

export const CATEGORIES = [
  'Architecture',
  'React',
  'TypeScript',
  'JavaScript',
  'CSS',
  'Backend',
  'DevOps',
] as const

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const

export const VALIDATION = {
  POST_TITLE_MIN_LENGTH: 5,
  POST_TITLE_MAX_LENGTH: 100,
  POST_CONTENT_MIN_LENGTH: 100,
  COMMENT_MIN_LENGTH: 1,
  COMMENT_MAX_LENGTH: 500,
} as const
```

### 3-3. Public API
```typescript
// shared/config/index.ts
export { env } from './env'
export * from './constants'
```

## 🏗️ 4. shared/hooks 구현

### 4-1. useLocalStorage
```typescript
// shared/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}
```

### 4-2. useDebounce
```typescript
// shared/hooks/useDebounce.ts
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
```

### 4-3. useMediaQuery
```typescript
// shared/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)

    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

// 편의 함수들
export const useIsMobile = () => useMediaQuery('(max-width: 768px)')
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1024px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
```

### 4-4. Public API
```typescript
// shared/hooks/index.ts
export { useLocalStorage } from './useLocalStorage'
export { useDebounce } from './useDebounce'
export { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop } from './useMediaQuery'
```

## 🏗️ 5. shared/types 구현

```typescript
// shared/types/common.ts
export type ID = string | number

export interface SelectOption<T = string> {
  label: string
  value: T
}

export interface TimeStamps {
  createdAt: Date
  updatedAt: Date
}

export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface LoadingState {
  status: Status
  error?: string
}
```

```typescript
// shared/types/index.ts
export type { ID, SelectOption, TimeStamps, Status, LoadingState } from './common'
```

## 🏗️ 6. shared/ui Public API

```typescript
// shared/ui/index.ts
export { Button, type ButtonProps } from './button'
export { Input, type InputProps } from './input'
export { Card, CardHeader, CardContent, CardFooter, type CardProps } from './card'
export { Avatar, AvatarImage, AvatarFallback } from './avatar'
export { Badge, type BadgeProps } from './badge'
export { Skeleton } from './skeleton'
// ... 다른 Shadcn 컴포넌트들
```

## 📦 필요한 패키지 설치

```bash
# API 클라이언트
npm install axios

# 개발 의존성
npm install -D @types/node
```

## 🎓 shared 설계 원칙

### ✅ 해야 할 것:
1. **순수 함수** - 부수효과 없는 함수
2. **재사용성** - 어디서든 사용 가능
3. **타입 안전** - 제네릭 활용
4. **문서화** - JSDoc 주석

### ❌ 하지 말아야 할 것:
1. **비즈니스 로직** - features에서 담당
2. **도메인 타입** - entities에서 정의
3. **상위 레이어 import** - 순환 의존성
4. **복잡한 로직** - 단순하게 유지

## 🧪 테스트 예시

```typescript
// App.tsx에서 테스트
import { formatDate, formatRelativeTime, formatNumber } from '@/shared/lib'
import { Button } from '@/shared/ui'
import { useLocalStorage, useIsMobile } from '@/shared/hooks'
import { CATEGORIES } from '@/shared/config'

function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  const isMobile = useIsMobile()

  return (
    <div className="p-8">
      <h1>Shared 레이어 테스트</h1>

      <div className="space-y-4">
        <p>오늘: {formatDate(new Date())}</p>
        <p>1시간 전: {formatRelativeTime(new Date(Date.now() - 3600000))}</p>
        <p>조회수: {formatNumber(12500)}</p>
        <p>테마: {theme}</p>
        <p>모바일: {isMobile ? 'Yes' : 'No'}</p>
        <p>카테고리: {CATEGORIES.join(', ')}</p>

        <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          테마 변경
        </Button>
      </div>
    </div>
  )
}
```

## 🎓 다음 단계 준비

이 단계를 완료하면:
- ✅ 공통 유틸리티 함수 구현
- ✅ API 클라이언트 설정
- ✅ 커스텀 훅 라이브러리
- ✅ UI 컴포넌트 라이브러리 구성
- ✅ features 구현 준비

**다음 단계**: [8단계 - features 레이어 구현](./step-08-features.md)

## 📚 참고 자료
- [FSD Shared Layer](https://feature-sliced.design/docs/reference/layers#shared)
- [Axios Documentation](https://axios-http.com/)
