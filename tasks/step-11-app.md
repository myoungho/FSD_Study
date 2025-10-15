# 11단계: app 레이어 구현 (라우터, 프로바이더)

## 📝 이 단계에서 배울 내용
- app 레이어의 역할과 책임
- 라우팅 설정 (React Router)
- 전역 프로바이더 구성
- 앱 초기화 로직

## 🎯 app 레이어란?

**역할:** 애플리케이션의 진입점과 전역 설정

### 특징:
- 🚪 **진입점** - 앱의 시작점
- 🌐 **전역 설정** - 라우터, 프로바이더, 글로벌 스타일
- 🔧 **초기화** - 앱 시작 시 필요한 로직
- 🚫 **비즈니스 로직 없음** - 설정과 조합만

### app에 포함되는 것:
- ✅ 라우터 설정
- ✅ Context Providers (Theme, Auth, React Query 등)
- ✅ 전역 스타일
- ✅ 에러 바운더리
- ✅ 앱 초기화 로직

## 📂 app 구조

```
app/
├── providers/
│   ├── RouterProvider.tsx      # 라우터 설정
│   ├── ThemeProvider.tsx       # 테마 프로바이더
│   ├── QueryProvider.tsx       # React Query
│   └── index.tsx               # 모든 프로바이더 조합
├── router/
│   ├── routes.tsx              # 라우트 정의
│   └── index.ts
├── styles/
│   └── global.css              # 전역 스타일 (이미 index.css에 있음)
└── App.tsx                     # 메인 앱 컴포넌트
```

## 🏗️ 1. 라우터 설정

### 1-1. 라우트 정의
```tsx
// app/router/routes.tsx
import { RouteObject } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import { PostDetailPage } from '@/pages/post-detail'
import { PostCreatePage } from '@/pages/post-create'
import { NotFoundPage } from '@/pages/not-found'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/posts/:id',
    element: <PostDetailPage />,
  },
  {
    path: '/posts/create',
    element: <PostCreatePage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]
```

```typescript
// app/router/index.ts
export { routes } from './routes'
```

### 1-2. Router Provider
```tsx
// app/providers/RouterProvider.tsx
import { BrowserRouter, useRoutes } from 'react-router-dom'
import { routes } from '../router'

function AppRoutes() {
  const element = useRoutes(routes)
  return element
}

export function RouterProvider() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
```

## 🏗️ 2. Theme Provider 구현

### 2-1. Theme Context
```tsx
// app/providers/ThemeProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme
    return stored || 'system'
  })

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem('theme', newTheme)
      setTheme(newTheme)
    },
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

## 🏗️ 3. React Query Provider (선택사항)

```tsx
// app/providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

```bash
# React Query 설치 (선택사항)
npm install @tanstack/react-query @tanstack/react-query-devtools
```

## 🏗️ 4. 모든 Providers 조합

```tsx
// app/providers/index.tsx
import { ThemeProvider } from './ThemeProvider'
import { RouterProvider } from './RouterProvider'
// import { QueryProvider } from './QueryProvider'  // 필요시 활성화

export function AppProviders() {
  return (
    <ThemeProvider>
      {/* <QueryProvider> */}
        <RouterProvider />
      {/* </QueryProvider> */}
    </ThemeProvider>
  )
}
```

## 🏗️ 5. Error Boundary

```tsx
// app/providers/ErrorBoundary.tsx
import { Component, ReactNode } from 'react'
import { Button } from '@/shared/ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">앗, 문제가 발생했습니다!</h1>
            <p className="text-muted-foreground">
              {this.state.error?.message || '알 수 없는 오류가 발생했습니다'}
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: undefined })
                window.location.href = '/'
              }}
            >
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

## 🏗️ 6. 메인 App 컴포넌트

```tsx
// src/App.tsx
import { AppProviders } from './app/providers'
import { ErrorBoundary } from './app/providers/ErrorBoundary'
import './index.css'

function App() {
  return (
    <ErrorBoundary>
      <AppProviders />
    </ErrorBoundary>
  )
}

export default App
```

## 🏗️ 7. main.tsx 정리

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

## 🎨 전역 스타일 추가

```css
/* src/index.css */
@import "tailwindcss";

/* 기본 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 다크 모드 */
.dark {
  color-scheme: dark;
}

/* 커스텀 스크롤바 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
```

## 🏗️ 8. Auth Context (확장 예시)

```tsx
// app/providers/AuthProvider.tsx (선택사항)
import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (email: string, password: string) => {
    // Mock login
    const mockUser: User = {
      id: '1',
      name: '김개발',
      email,
      avatar: 'https://i.pravatar.cc/150?img=1',
    }

    setUser(mockUser)
    localStorage.setItem('user', JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('auth_token')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

사용 시 AppProviders에 추가:
```tsx
// app/providers/index.tsx
export function AppProviders() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider />
      </AuthProvider>
    </ThemeProvider>
  )
}
```

## 🏗️ 9. 환경 변수 설정

```env
# .env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=FSD Blog
```

```typescript
// shared/config/env.ts
export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  appName: import.meta.env.VITE_APP_NAME || 'FSD Blog',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
```

## 🧪 테스트하기

개발 서버 실행:
```bash
npm run dev
```

확인 사항:
- ✅ 라우팅이 제대로 작동하는가?
- ✅ 페이지 간 이동이 부드러운가?
- ✅ 다크 모드가 작동하는가? (구현 시)
- ✅ 에러가 발생하면 에러 바운더리가 작동하는가?

## 🎓 app 레이어 설계 원칙

### ✅ 해야 할 것:
1. **전역 설정** - 프로바이더, 라우터
2. **초기화 로직** - 앱 시작 시 필요한 로직
3. **조합** - 모든 레이어를 연결
4. **에러 처리** - 전역 에러 핸들링

### ❌ 하지 말아야 할 것:
1. **비즈니스 로직** - features에서
2. **UI 컴포넌트** - 다른 레이어에서
3. **복잡한 로직** - 단순하게 유지
4. **직접적인 DOM 조작**

## 🎨 Providers 조합 순서

중요한 순서 (안쪽부터 바깥쪽):
```tsx
<ErrorBoundary>           {/* 1. 최상단 에러 처리 */}
  <ThemeProvider>         {/* 2. 테마 */}
    <AuthProvider>        {/* 3. 인증 */}
      <QueryProvider>     {/* 4. 데이터 페칭 */}
        <RouterProvider>  {/* 5. 라우팅 */}
      </QueryProvider>
    </AuthProvider>
  </ThemeProvider>
</ErrorBoundary>
```

## 🎓 다음 단계 준비

이 단계를 완료하면:
- ✅ 완전한 FSD 아키텍처 구현
- ✅ 라우팅 및 프로바이더 설정
- ✅ 전역 상태 관리 준비
- ✅ 프로덕션 준비 완료

**다음 단계**: [12단계 - ESLint + FSD 플러그인](./step-12-eslint.md)

## 📚 참고 자료
- [FSD App Layer](https://feature-sliced.design/docs/reference/layers#app)
- [React Router](https://reactrouter.com/)
- [React Query](https://tanstack.com/query/latest)
- [Context Best Practices](https://react.dev/learn/passing-data-deeply-with-context)
