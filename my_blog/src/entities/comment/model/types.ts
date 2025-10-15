// entities/comment/model/types.ts
export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  isEdited: boolean;
}
