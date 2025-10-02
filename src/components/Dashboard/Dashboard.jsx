import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

function Dashboard() {
  const [staff, setStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStaff() {
      try {
        const response = await fetch("http://localhost:3000/api/staff", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const staffObject = await response.json();
          setStaff(staffObject);
        } else if (response.status === 401) {
          setStaff(null);
        }
      } catch (error) {
        console.error(error);
        setStaff(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStaff();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!staff) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <main id="dashboard">
      <table id="staff-table">
        <tr>
          <th>Staff name</th>
          <th>Status</th>
        </tr>
        {staff.map((s) => {
          return (
            <tr>
              <td>{s.full_name}</td>
              <td>{s.status}</td>
            </tr>
          );
        })}
      </table>
    </main>
  );
}

export default Dashboard;
