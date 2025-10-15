// widgets/post-list/ui/PostList.tsx
import { useNavigate } from 'react-router-dom'
import { PostCard, PostCardSkeleton } from '@/entities/post'
import { LikeButton } from '@/features/post-like'
import { Button } from '@/shared/ui/button'
import { usePostList } from '../model/usePostList'

export function PostList() {
  const navigate = useNavigate()
  const { posts, pagination, isLoading, error, page, setPage } = usePostList()

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          다시 시도
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Post Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div key={post.id} className="relative">
            <PostCard post={post} onClick={() => navigate(`/posts/${post.id}`)} />

            {/* Like Button Overlay */}
            <div className="absolute bottom-4 right-4">
              <LikeButton
                postId={post.id}
                initialLikesCount={post.likesCount}
                initialIsLiked={false}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1}>
            이전
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === page ? 'default' : 'outline'}
                onClick={() => setPage(pageNum)}
                size="sm"
              >
                {pageNum}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.totalPages}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  )
}
