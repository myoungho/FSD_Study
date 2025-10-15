// widgets/post-list/model/types.ts
import type { PostPreview } from '@/entities/post'
import type { PaginatedResponse } from '@/shared/api'

export interface PostListFilters {
  category?: string
  tag?: string
  search?: string
}

export type PostListData = PaginatedResponse<PostPreview>
