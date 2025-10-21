import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './shared/styles/index.scss'
import {
  reportWebVitals,
  logWebVitals,
  sendToAnalytics,
} from './shared/utils/webVitals'

// Optimize QueryClient for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
})

const container = document.getElementById('root')

// Remove initial loader if it exists
const initialLoader = document.getElementById('initial-loader')
if (initialLoader) {
  initialLoader.remove()
}

const root = createRoot(container!)

// Use concurrent rendering for better performance
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)

// Measure and report web vitals
reportWebVitals((metric) => {
  logWebVitals(metric)
  sendToAnalytics(metric)
})
