import { apiClient } from '@/shared/api'
import { LikeState } from '../model/types'

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
