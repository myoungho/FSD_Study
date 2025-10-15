// widgets/sidebar/ui/Sidebar.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { CATEGORIES } from '@/shared/config'

export function Sidebar() {
  const popularTags = ['React', 'TypeScript', 'FSD', 'Tailwind', 'Vite']

  return (
    <aside className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">카테고리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {CATEGORIES.map((category) => (
              <a
                key={category}
                href={`/categories/${category}`}
                className="text-sm hover:text-primary transition-colors"
              >
                {category}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">인기 태그</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">소개</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            FSD 아키텍처로 구축한 모던 블로그 플랫폼입니다.
          </p>
        </CardContent>
      </Card>
    </aside>
  )
}
