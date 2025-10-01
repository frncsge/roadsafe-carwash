import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";
import LandingPage from "./LandingPage";
import AdminLayout from "./AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<LoginForm />} />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout /> 
            </ProtectedRoute>
          }
        >
          {/* nested route which is the output of the outlet inside adminLayout component */}
          <Route path="dashboard" element={<Dashboard />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
