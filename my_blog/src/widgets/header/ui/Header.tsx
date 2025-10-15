import { Link } from 'react-router-dom'
import { Navigation } from './Navigation'
import { UserMenu } from './UserMenu'
import { Button } from '@/shared/ui'
import { APP_NAME } from '@/shared/config'
import { useIsMobile } from '@/shared/hooks'

interface HeaderProps {
  user?: {
    name: string
    avatar?: string
  }
  onLogout?: () => void
}

export function Header({ user, onLogout }: HeaderProps) {
  const isMobile = useIsMobile()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            F
          </div>
          {!isMobile && <span className="text-xl font-bold">{APP_NAME}</span>}
        </Link>

        {/* Navigation */}
        {!isMobile && <Navigation />}

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {user && (
            <Button size="sm" asChild>
              <Link to="/posts/create">글쓰기</Link>
            </Button>
          )}
          <UserMenu user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  )
}
