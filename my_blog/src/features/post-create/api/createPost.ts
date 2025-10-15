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
