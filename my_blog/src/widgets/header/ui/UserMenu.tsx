import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui'
import { UserAvatar } from '@/entities/user'
interface UserMenuProps {
  user?: {
    name: string
    avatar?: string
  }
  onLogout?: () => void
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" asChild>
          <a href="/login">로그인</a>
        </Button>
        <Button size="sm" asChild>
          <a href="/signup">회원가입</a>
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
          <UserAvatar name={user.name} avatar={user.avatar} size="sm" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">내 프로필</p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <a href="/profile">프로필</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/posts/create">포스트 작성</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/settings">설정</a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onLogout} className="text-destructive">
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
