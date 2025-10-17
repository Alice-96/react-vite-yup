import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, BasicValidationPage, NestedValidationPage } from './features';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/yup" element={<BasicValidationPage />} />
        <Route path="/yupNested" element={<NestedValidationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
