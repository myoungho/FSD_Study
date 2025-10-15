import { useState } from 'react'
import { toggleLike } from '../api/toggleLike'
import type { LikeState } from './types'

export function useLikePost(postId: string, initialState: LikeState) {
  const [state, setState] = useState<LikeState>(initialState)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleLike = async () => {
    setIsLoading(true)

    // Optimistic update
    const previousState = { ...state }
    setState({
      isLiked: !state.isLiked,
      likesCount: state.isLiked ? state.likesCount - 1 : state.likesCount + 1,
    })

    try {
      const newState = await toggleLike(postId)
      setState(newState)
    } catch (error) {
      // Rollback on error
      setState(previousState)
      console.error('Failed to toggle like:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLiked: state.isLiked,
    likesCount: state.likesCount,
    isLoading,
    toggleLike: handleToggleLike,
  }
}
