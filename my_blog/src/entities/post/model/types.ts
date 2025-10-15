// entities/post/model/types.ts
export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string; // 요약
  coverImage?: string; // 커버 이미지
  authorId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  isPublished: boolean;
}

export interface PostPreview {
  id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  publishedAt: Date;
  likesCount: number;
  commentsCount: number;
}
