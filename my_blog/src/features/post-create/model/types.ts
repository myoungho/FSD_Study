// features/post-create/model/types.ts
export interface CreatePostData {
  title: string
  content: string
  excerpt: string
  coverImage?: string
  category: string
  tags: string[]
  isPublished: boolean
}

export interface CreatePostFormData {
  title: string
  content: string
  category: string
  tags: string
  isPublished: boolean
}
