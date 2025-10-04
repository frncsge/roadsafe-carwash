import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

function Dashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [staff, setStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStaff() {
      try {
        const response = await fetch(API_URL + "/api/staff", {
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
        <thead>
          <tr>
            <th>Staff name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => {
            return (
              <tr>
                <td>{s.full_name}</td>
                <td>{s.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <table id="staff-table">
        <thead>
          <tr>
            <th>Staff name</th>
            <th>Status</th>
            <th>Assigned to</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => {
            return (
              <tr>
                <td>{s.full_name}</td>
                <td>{s.status}</td>
                <td>{s.assigned_to}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}

export default Dashboard;
