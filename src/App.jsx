import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";
import LandingPage from "./LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/adminLogin" element={<LoginForm />}/>
        <Route path="/adminDashboard" element={<Dashboard />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
