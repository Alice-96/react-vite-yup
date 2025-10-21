// Web Vitals measurement utility
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

type MetricName = 'CLS' | 'INP' | 'FCP' | 'LCP' | 'TTFB'

interface Metric {
  name: MetricName
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  entries: PerformanceEntry[]
  id: string
  navigationType: string
}

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry)
    onINP(onPerfEntry) // INP replaces FID in web-vitals v3+
    onFCP(onPerfEntry)
    onLCP(onPerfEntry)
    onTTFB(onPerfEntry)
  }
}

// Development mode logging
const logWebVitals = (metric: Metric) => {
  if (import.meta.env.DEV) {
    console.group(`🔍 Web Vitals: ${metric.name}`)
    console.log(`Value: ${metric.value.toFixed(2)}ms`)
    console.log(`Rating: ${metric.rating}`)
    console.log(`ID: ${metric.id}`)
    console.groupEnd()
  }
}

// Production mode analytics
const sendToAnalytics = (metric: Metric) => {
  if (import.meta.env.PROD) {
    // Here you would send to your analytics service
    // Example: Google Analytics, DataDog, etc.
    console.log('Sending to analytics:', metric)
  }
}

export { reportWebVitals, logWebVitals, sendToAnalytics }
export type { Metric, MetricName }