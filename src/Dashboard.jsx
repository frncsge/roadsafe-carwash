import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

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
    return <h1>Loading...</h1>; //temporary 🙏
  }

  return admin ? <h1>I am {admin.admin_name}. hello 🔥</h1> : <Navigate to="/admin/login"/>;
}

export default Dashboard;
