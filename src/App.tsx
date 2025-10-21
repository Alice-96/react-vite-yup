import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { CircularProgress, Box } from '@mui/material'
import { HomePage } from './features'

// Lazy load components for code splitting
const UserListPage = lazy(() => import('./features/userList/UserListPage'))
const UserRegistrationPage = lazy(
  () => import('./features/user/registration/UserRegistrationPage')
)
const LocationRegistrationPage = lazy(
  () => import('./features/location/registration/LocationRegistrationPage')
)

// Loading fallback component
const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="200px"
  >
    <CircularProgress />
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
