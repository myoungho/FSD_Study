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
