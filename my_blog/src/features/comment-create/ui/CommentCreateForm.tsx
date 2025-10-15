// features/comment-create/ui/CommentCreateForm.tsx
import { useState } from 'react'
import { Button, Textarea } from '@/shared/ui'
import { useCreateComment } from '../model/useCreateComment'

interface CommentCreateFormProps {
  postId: string
  onSuccess?: () => void
}

export function CommentCreateForm({ postId, onSuccess }: CommentCreateFormProps) {
  const [content, setContent] = useState('')
  const { create, isLoading } = useCreateComment(onSuccess)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    await create({ postId, content })
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 작성하세요..."
        rows={3}
      />
      <Button type="submit" disabled={isLoading || !content.trim()}>
        {isLoading ? '작성 중...' : '댓글 작성'}
      </Button>
    </form>
  )
}
