import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

function Dashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [staff, setStaff] = useState(null);
  const [queue, setQueue] = useState(null);
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);
  const [isLoadingQueue, setIsLoadingQueue] = useState(true);

  useEffect(() => {
    async function fetchQueue() {
      try {
        const response = await fetch(API_URL + "/api/queue", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const queueObject = await response.json();
          setQueue(queueObject);
        } else if (response.status === 401) {
          setQueue(null);
        }
      } catch (error) {
        console.error(error);
        setQueue(null);
      } finally {
        setIsLoadingQueue(false);
      }
    }

    fetchQueue();
  }, []);

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
        setIsLoadingStaff(false);
      }
    }

    fetchStaff();
  }, []);

  if (isLoadingStaff || isLoadingQueue) {
    return <LoadingScreen />;
  }

  if (!staff || !queue) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <main id="dashboard">
      <table id="queue-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Customer name</th>
            <th>Vehicle</th>
            <th>Type</th>
            <th>Service bought</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Staff assigned</th>
          </tr>
        </thead>
        <tbody>
          {queue.map((q, index) => {
            return (
              <tr>
                <td>{index + 1}</td>
                <td>{q.customer_name}</td>
                <td>{q.customer_vehicle}</td>
                <td>{q.type}</td>
                <td>{q.service_bought}</td>
                <td>{q.total_amount}</td>
                <td>{q.status}</td>
                <td>{q.staff_assigned}</td>
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
