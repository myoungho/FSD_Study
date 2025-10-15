// pages/post-detail/ui/PostDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom'
import { Header } from '@/widgets/header'
import { CommentSection } from '@/widgets/comment-section'
import { LikeButton } from '@/features/post-like'
import { UserAvatar } from '@/entities/user'
import { Card, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { formatDate } from '@/shared/lib'
import { usePostDetail } from '../model/usePostDetail'

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { post, isLoading, error } = usePostDetail(id!)

  const currentUser = {
    name: '김개발',
    avatar: 'https://i.pravatar.cc/150?img=1',
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header user={currentUser} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">오류가 발생했습니다</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate('/')}>홈으로 돌아가기</Button>
          </div>
        </main>
      </div>
    )
  }

  if (isLoading || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header user={currentUser} />
        <main className="flex-1">
          <div className="container max-w-4xl py-8">
            <Skeleton className="h-[400px] mb-8" />
            <Skeleton className="h-12 mb-4" />
            <Skeleton className="h-64" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={currentUser} />

      <main className="flex-1">
        <article className="container max-w-4xl py-8">
          {/* Cover Image */}
          {post.coverImage && (
            <div className="aspect-video overflow-hidden rounded-lg mb-8">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Post Header */}
          <header className="mb-8">
            {/* Category & Date */}
            <div className="flex items-center gap-3 mb-4">
              <Badge>{post.category}</Badge>
              <time className="text-sm text-muted-foreground">
                {formatDate(post.publishedAt, 'long')}
              </time>
              {post.updatedAt > post.publishedAt && (
                <span className="text-sm text-muted-foreground">(수정됨)</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

            {/* Author & Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserAvatar name={post.author.name} avatar={post.author.avatar} size="md" />
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <p className="text-sm text-muted-foreground">조회 {post.viewsCount}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <LikeButton
                  postId={post.id}
                  initialLikesCount={post.likesCount}
                  initialIsLiked={false}
                />
                <span className="text-sm text-muted-foreground">💬 {post.commentsCount}</span>
              </div>
            </div>
          </header>

          {/* Post Content */}
          <Card className="mb-8">
            <CardContent className="prose prose-lg max-w-none pt-6">
              {/* 실제로는 마크다운 렌더러 사용 */}
              <div className="whitespace-pre-wrap">{post.content}</div>
            </CardContent>
          </Card>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Comment Section */}
          <CommentSection postId={post.id} />
        </article>
      </main>
    </div>
  )
}
