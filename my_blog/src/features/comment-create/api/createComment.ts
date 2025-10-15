// features/comment-create/api/createComment.ts
import type { Comment } from '@/entities/comment'
import type { CreateCommentData } from '../model/types'

export async function createComment(data: CreateCommentData): Promise<Comment> {
  // Mock
  return {
    id: Math.random().toString(36).substr(2, 9),
    postId: data.postId,
    authorId: '1',
    author: {
      id: '1',
      name: '현재 사용자',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    content: data.content,
    createdAt: new Date(),
    updatedAt: new Date(),
    likesCount: 0,
    isEdited: false,
  }
}
