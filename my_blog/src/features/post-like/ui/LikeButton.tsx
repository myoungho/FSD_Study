import { Button } from '@/shared/ui/button'
import { formatNumber } from '@/shared/lib'
import { useLikePost } from '../model/useLikePost'
import { cn } from '@/shared/lib'

interface LikeButtonProps {
  postId: string
  initialLikesCount: number
  initialIsLiked: boolean
  className?: string
}

export function LikeButton({
  postId,
  initialLikesCount,
  initialIsLiked,
  className,
}: LikeButtonProps) {
  const { isLiked, likesCount, isLoading, toggleLike } = useLikePost(postId, {
    isLiked: initialIsLiked,
    likesCount: initialLikesCount,
  })

  return (
    <Button
      variant={isLiked ? 'default' : 'outline'}
      size="sm"
      onClick={toggleLike}
      disabled={isLoading}
      className={cn('gap-2', className)}
    >
      <span className={cn(isLiked && 'scale-125 transition-transform')}>
        {isLiked ? '❤️' : '🤍'}
      </span>
      <span>{formatNumber(likesCount)}</span>
    </Button>
  )
}
