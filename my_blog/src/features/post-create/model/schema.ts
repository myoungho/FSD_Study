import { z } from 'zod'
import { VALIDATION } from '@/shared/config'

export const createPostSchema = z.object({
  title: z
    .string()
    .min(VALIDATION.POST_TITLE_MIN_LENGTH, '제목은 최소 5자 이상이어야 합니다')
    .max(VALIDATION.POST_TITLE_MAX_LENGTH, '제목은 최대 100자까지 가능합니다'),
  content: z
    .string()
    .min(VALIDATION.POST_CONTENT_MIN_LENGTH, '내용은 최소 100자 이상이어야 합니다'),
  category: z.string().min(1, '카테고리를 선택해주세요'),
  tags: z.string(),
  isPublished: z.boolean().default(false),
})
