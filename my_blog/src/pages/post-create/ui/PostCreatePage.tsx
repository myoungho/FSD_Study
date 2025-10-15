// pages/post-create/ui/PostCreatePage.tsx
import { Header } from '@/widgets/header'
import { CreatePostForm } from '@/features/post-create'

export function PostCreatePage() {
  const currentUser = {
    name: '김개발',
    avatar: 'https://i.pravatar.cc/150?img=1',
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={currentUser} />

      <main className="flex-1 bg-gray-50">
        <div className="container max-w-4xl py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">새 포스트 작성</h1>
            <p className="text-muted-foreground mt-2">당신의 생각을 공유해보세요</p>
          </div>

          <CreatePostForm />
        </div>
      </main>
    </div>
  )
}
