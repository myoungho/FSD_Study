// app/providers/ErrorBoundary.tsx
import { Component, ReactNode } from 'react'
import { Button } from '@/shared/ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">앗, 문제가 발생했습니다!</h1>
            <p className="text-muted-foreground">
              {this.state.error?.message || '알 수 없는 오류가 발생했습니다'}
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: undefined })
                window.location.href = '/'
              }}
            >
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
