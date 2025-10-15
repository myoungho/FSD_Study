// widgets/comment-section/ui/CommentSection.tsx
import { useState, useEffect } from 'react'
import { CommentItem } from '@/entities/comment'
import { CommentCreateForm } from '@/features/comment-create'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import type { Comment } from '@/entities/comment'

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data
    setTimeout(() => {
      setComments([
        {
          id: '1',
          postId,
          authorId: '1',
          author: {
            id: '1',
            name: '김댓글',
            avatar: 'https://i.pravatar.cc/150?img=4',
          },
          content: '정말 유익한 글이네요! 감사합니다.',
          createdAt: new Date('2024-01-20T10:30:00'),
          updatedAt: new Date('2024-01-20T10:30:00'),
          likesCount: 5,
          isEdited: false,
        },
        {
          id: '2',
          postId,
          authorId: '2',
          author: {
            id: '2',
            name: '이리뷰',
            avatar: 'https://i.pravatar.cc/150?img=5',
          },
          content: 'FSD 아키텍처 도입 후 프로젝트 구조가 정말 깔끔해졌어요.',
          createdAt: new Date('2024-01-20T14:15:00'),
          updatedAt: new Date('2024-01-20T14:15:00'),
          likesCount: 3,
          isEdited: false,
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [postId])

  const handleCommentCreated = () => {
    // Refresh comments
    console.log('Comment created, refreshing...')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>댓글 {comments.length}개</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Comment Form */}
        <CommentCreateForm postId={postId} onSuccess={handleCommentCreated} />

        {/* Comments List */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24" />)
          ) : comments.length > 0 ? (
            comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
          ) : (
            <p className="text-center text-muted-foreground py-8">첫 번째 댓글을 작성해보세요!</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
