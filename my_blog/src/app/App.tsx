// src/App.tsx
import { AppProviders } from './app/providers'
import { ErrorBoundary } from './app/providers/ErrorBoundary'
import './index.css'

function App() {
  return (
    <ErrorBoundary>
      <AppProviders />
    </ErrorBoundary>
  )
}

export default App
