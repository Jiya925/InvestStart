import { BrowserRouter, Routes, Route } from "react-router-dom";

import Learn from "./pages/Learn";
import Analyze from "./pages/Analyze";
import Practice from "./pages/Practice";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Learn />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/practice" element={<Practice />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;