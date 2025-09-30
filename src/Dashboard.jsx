import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

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
          navigate("/admin/login"); //redirect to login page.
        }
      } catch (error) {
        console.error(error);
        navigate("/admin/login"); //fallback
      } 
    }

    fetchAdmin();
  }, []);

  if (!admin) {
    return <h1>Loading...</h1>; //temporary 🙏
  }

  return <h1>I am {admin.admin_name}. hello 🔥</h1>;
}

export default Dashboard;
