// entities/post/api/getPosts.ts
import type { Post, PostPreview } from "../model/types";

// 나중에 실제 API로 교체
export async function getPosts(): Promise<PostPreview[]> {
  // Mock data
  return [
    {
      id: "1",
      title: "FSD 아키텍처 완벽 가이드",
      excerpt:
        "Feature-Sliced Design을 실전 프로젝트에 적용하는 방법을 알아봅니다.",
      coverImage: "https://picsum.photos/800/400?random=1",
      author: {
        name: "김개발",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      category: "Architecture",
      publishedAt: new Date("2024-01-15"),
      likesCount: 42,
      commentsCount: 12,
    },
    {
      id: "2",
      title: "React 19의 새로운 기능들",
      excerpt: "React 19에서 추가된 신기능과 변경사항을 살펴봅니다.",
      coverImage: "https://picsum.photos/800/400?random=2",
      author: {
        name: "이프론트",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      category: "React",
      publishedAt: new Date("2024-01-20"),
      likesCount: 89,
      commentsCount: 23,
    },
  ];
}

// entities/post/api/getPostById.ts
export async function getPostById(id: string): Promise<Post> {
  // Mock data
  return {
    id,
    title: "FSD 아키텍처 완벽 가이드",
    content: "# FSD 소개\n\n실전 예제로 배우는...",
    excerpt:
      "Feature-Sliced Design을 실전 프로젝트에 적용하는 방법을 알아봅니다.",
    coverImage: "https://picsum.photos/800/400?random=1",
    authorId: "1",
    author: {
      id: "1",
      name: "김개발",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    category: "Architecture",
    tags: ["FSD", "Architecture", "React"],
    publishedAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    likesCount: 42,
    commentsCount: 12,
    viewsCount: 532,
    isPublished: true,
  };
}
