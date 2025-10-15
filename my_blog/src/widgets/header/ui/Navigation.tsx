import { Link } from 'react-router-dom'
import { cn } from '@/shared/lib'

const navItems = [
  { label: '홈', href: '/' },
  { label: '포스트', href: '/posts' },
  { label: '카테고리', href: '/categories' },
  { label: '소개', href: '/about' },
]

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  return (
    <nav className={cn('flex gap-6', className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
