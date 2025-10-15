// pages/not-found/ui/NotFoundPage.tsx
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Header } from '@/widgets/header'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-3xl font-bold mt-4 mb-2">페이지를 찾을 수 없습니다</h2>
          <p className="text-muted-foreground mb-8">
            요청하신 페이지가 존재하지 않거나 이동되었습니다.
          </p>

          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate(-1)} variant="outline">
              이전 페이지
            </Button>
            <Button onClick={() => navigate('/')}>홈으로 가기</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
