// app/providers/index.tsx
import { ThemeProvider } from './ThemeProvider'
import { RouterProvider } from './RouterProvider'
// import { QueryProvider } from './QueryProvider'  // 필요시 활성화

export function AppProviders() {
  return (
    <ThemeProvider>
      <RouterProvider />
    </ThemeProvider>
  )
}