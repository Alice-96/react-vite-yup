import { Typography } from '@mui/material'
import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import '../../shared/styles/index.scss'
import Page from '../../shared/components/Page'

// Navigation links data for better maintainability
const navigationLinks = [
  { to: '/user-registration', label: 'ユーザー登録' },
  { to: '/location-registration', label: '拠点登録' },
  { to: '/user-list', label: 'ユーザー一覧' },
] as const

const HomePage: React.FC = memo(() => {
  return (
    <Page>
      <Typography component="h1" variant="h4" color="primary" sx={{ mb: 3 }}>
        ホーム
      </Typography>
      <Typography component="h2" variant="h6" color="primary" sx={{ mb: 2 }}>
        メニュー
      </Typography>
      <nav role="navigation" aria-label="メインナビゲーション">
        {navigationLinks.map(({ to, label }) => (
          <div key={to} style={{ marginBottom: '16px' }}>
            <Link
              to={to}
              style={{
                textDecoration: 'none',
                color: '#1976d2',
                fontSize: '16px',
                padding: '8px 16px',
                display: 'inline-block',
                borderRadius: '4px',
                border: '1px solid #1976d2',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1976d2'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#1976d2'
              }}
            >
              {label}
            </Link>
          </div>
        ))}
      </nav>
    </Page>
  )
})

HomePage.displayName = 'HomePage'

export default HomePage
