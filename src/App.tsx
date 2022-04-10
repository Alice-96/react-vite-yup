import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopPage from './TopPage';
import YupTrialPage from './YupTrialPage';
import YupTrialNestedPage from './YupTrialNestedPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/yup" element={<YupTrialPage />} />
        <Route path="/yupNested" element={<YupTrialNestedPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
