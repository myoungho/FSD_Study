import { useState } from 'react'
import {
  Button,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui'
import { CATEGORIES } from '@/shared/config'
import { useCreatePost } from '../model/useCreatePost'
import type { CreatePostFormData } from '../model/types'

export function CreatePostForm() {
  const { create, isLoading, error } = useCreatePost()
  const [formData, setFormData] = useState<CreatePostFormData>({
    title: '',
    content: '',
    category: '',
    tags: '',
    isPublished: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await create({
      ...formData,
      excerpt: formData.content.substring(0, 150),
      tags: formData.tags.split(',').map((tag) => tag.trim()),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>새 포스트 작성</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">제목</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="포스트 제목을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">카테고리</label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">내용</label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="포스트 내용을 작성하세요"
              rows={10}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">태그 (쉼표로 구분)</label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="React, TypeScript, FSD"
            />
          </div>

          {error && <div className="text-sm text-destructive">{error}</div>}

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '작성 중...' : '포스트 작성'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
            >
              {formData.isPublished ? '초안으로 저장' : '바로 발행'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
