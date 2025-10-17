import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, UserListPage, UserRegistrationPage, LocationRegistrationPage } from './features';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user-registration" element={<UserRegistrationPage />} />
        <Route path="/location-registration" element={<LocationRegistrationPage />} />
        <Route path="/user-list" element={<UserListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
