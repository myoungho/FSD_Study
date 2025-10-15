// shared/config/env.ts
export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  appName: import.meta.env.VITE_APP_NAME || 'FSD Blog',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
