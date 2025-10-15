// pages/home/ui/HomePage.tsx
import { Header } from '@/widgets/header'
import { PostList } from '@/widgets/post-list'
import { Sidebar } from '@/widgets/sidebar'

export function HomePage() {
  // Mock user data (나중에 auth context에서 가져올 예정)
  const currentUser = {
    name: '김개발',
    avatar: 'https://i.pravatar.cc/150?img=1',
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header user={currentUser} />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container py-8">
          {/* Hero Section */}
          <section className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">FSD 블로그에 오신 것을 환영합니다</h1>
            <p className="text-xl text-muted-foreground">
              Feature-Sliced Design으로 구축한 모던 블로그 플랫폼
            </p>
          </section>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            {/* Posts */}
            <div>
              <h2 className="text-2xl font-bold mb-6">최근 포스트</h2>
              <PostList />
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-20">
                <Sidebar />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
