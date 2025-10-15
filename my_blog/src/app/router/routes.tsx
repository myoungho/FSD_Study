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
