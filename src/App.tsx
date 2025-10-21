import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { CircularProgress, Box } from '@mui/material'

// Lazy load ALL components for optimal code splitting
const HomePage = lazy(() => import('./features/home/HomePage'))
const UserListPage = lazy(() => import('./features/userList/UserListPage'))
const UserRegistrationPage = lazy(
  () => import('./features/user/registration/UserRegistrationPage')
)
const LocationRegistrationPage = lazy(
  () => import('./features/location/registration/LocationRegistrationPage')
)

// Optimized loading fallback component
const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="200px"
    role="status"
    aria-label="コンテンツを読み込み中"
  >
    <CircularProgress size={40} />
  </Box>
)

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user-registration" element={<UserRegistrationPage />} />
          <Route
            path="/location-registration"
            element={<LocationRegistrationPage />}
          />
          <Route path="/user-list" element={<UserListPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
