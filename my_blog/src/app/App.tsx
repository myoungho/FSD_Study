// src/App.tsx
import { AppProviders } from './providers'
import { ErrorBoundary } from './providers/ErrorBoundary'
import './styles/index.css'

function App() {
  return (
    <ErrorBoundary>
      <AppProviders />
    </ErrorBoundary>
  )
}
export default App
