// src/App.tsx
import { PostCard, PostCardSkeleton } from "@/entities/post";

function App() {
  const mockPost = {
    id: "1",
    title: "FSD 아키텍처 완벽 가이드",
    excerpt: "Feature-Sliced Design을 실전 프로젝트에 적용하는 방법",
    coverImage: "https://picsum.photos/800/400?random=1",
    author: {
      name: "김개발",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    category: "Architecture",
    publishedAt: new Date(),
    likesCount: 42,
    commentsCount: 12,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Entities 테스트</h1>

        <section>
          <h2 className="text-xl font-semibold mb-4">PostCard</h2>
          <PostCard post={mockPost} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Loading State</h2>
          <PostCardSkeleton />
        </section>
      </div>
    </div>
  );
}

export default App;
