// widgets/post-list/api/getPostList.ts
import type { PostListData, PostListFilters } from '../model/types'

export async function getPostList(
  page: number = 1,
  filters?: PostListFilters
): Promise<PostListData> {
  // Mock data
  const mockPosts = [
    {
      id: '1',
      title: 'FSD 아키텍처 완벽 가이드',
      excerpt: 'Feature-Sliced Design을 실전 프로젝트에 적용하는 방법을 알아봅니다.',
      coverImage: 'https://picsum.photos/800/400?random=1',
      author: { name: '김개발', avatar: 'https://i.pravatar.cc/150?img=1' },
      category: 'Architecture',
      publishedAt: new Date('2024-01-15'),
      likesCount: 42,
      commentsCount: 12,
    },
    {
      id: '2',
      title: 'React 19의 새로운 기능들',
      excerpt: 'React 19에서 추가된 신기능과 변경사항을 살펴봅니다.',
      coverImage: 'https://picsum.photos/800/400?random=2',
      author: { name: '이프론트', avatar: 'https://i.pravatar.cc/150?img=2' },
      category: 'React',
      publishedAt: new Date('2024-01-20'),
      likesCount: 89,
      commentsCount: 23,
    },
    {
      id: '3',
      title: 'TypeScript 5.0 새 기능',
      excerpt: 'TypeScript 5.0의 주요 변경사항과 새로운 기능들을 정리했습니다.',
      coverImage: 'https://picsum.photos/800/400?random=3',
      author: { name: '박타입', avatar: 'https://i.pravatar.cc/150?img=3' },
      category: 'TypeScript',
      publishedAt: new Date('2024-01-25'),
      likesCount: 67,
      commentsCount: 15,
    },
  ]

  return {
    data: mockPosts,
    pagination: {
      page,
      pageSize: 10,
      total: 30,
      totalPages: 3,
    },
  }
}
