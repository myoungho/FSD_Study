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
