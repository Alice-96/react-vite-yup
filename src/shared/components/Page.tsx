import {
  AppBar,
  Container,
  Paper,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import React, { memo } from 'react'

interface PageProps {
  children: React.ReactNode
}

const Page: React.FC<PageProps> = memo(({ children }) => {
  return (
    <>
      <AppBar position="static" component="header">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="メニューを開く"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            color="inherit"
            component="h1"
            sx={{ flexGrow: 1 }}
          >
            YupTrial
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} component="main">
        <Paper
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 240,
            borderRadius: 2,
            boxShadow: 1,
          }}
          elevation={1}
        >
          {children}
        </Paper>
      </Container>
    </>
  )
})

Page.displayName = 'Page'

export default Page
