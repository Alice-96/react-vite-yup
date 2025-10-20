import { Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import '../../shared/styles/index.scss'
import Page from '../../shared/components/Page'

const HomePage: React.FC = () => {
  return (
    <Page>
      <Typography component="h2" variant="h6" color="primary">
        Links
      </Typography>
      <div>
        <div>
          <Link to="/user-registration">ユーザー登録</Link>
        </div>
        <div>
          <Link to="/location-registration">拠点登録</Link>
        </div>
        <div>
          <Link to="/user-list">ユーザー一覧</Link>
        </div>
      </div>
    </Page>
  )
}

export default HomePage
