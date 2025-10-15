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
