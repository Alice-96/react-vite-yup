import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Top from './Top';
import YupTrial from './YupTrial';
import YupTrialNested from './YupTrialNested';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/yup" element={<YupTrial />} />
        <Route path="/yupNested" element={<YupTrialNested />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
