// pages/post-detail/model/usePostDetail.ts
import { useState, useEffect } from 'react'
import { getPostById } from '@/entities/post'
import type { Post } from '@/entities/post'

export function usePostDetail(postId: string) {
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getPostById(postId)
        setPost(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '포스트를 불러올 수 없습니다')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  return { post, isLoading, error }
}
