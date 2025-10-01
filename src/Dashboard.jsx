import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import TopBar from "./TopBar";

function Dashboard() {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const response = await fetch("http://localhost:3000/api/admin/me", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const adminObject = await response.json();
          setAdmin(adminObject);
        } else if (response.status === 401) {
          setAdmin(null);
        }
      } catch (error) {
        console.error(error);
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAdmin();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (admin) {
    return (
      <div id="dashboard-container">
        <TopBar />
      </div>
    );
  } else {
    <Navigate to="/admin/login" />;
  }
}

export default Dashboard;
