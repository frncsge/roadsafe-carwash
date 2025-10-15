import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import ConfirmDelete from "../ConfirmDelete/ConfirmDelete";

function QueuePage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [queue, setQueue] = useState(null);
  const [isLoadingQueue, setIsLoadingQueue] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  if (isLoadingQueue) {
    return <LoadingScreen />;
  }

  if (!queue) {
    return <Navigate to="/admin/login" />;
  }

  async function handleDeleteClick(queue_id, name, vehicle) {
    setItemToDelete({ queue_id, name, vehicle });
    setShowConfirmModal(true);
  }

  async function handleDeleteConfirm(isConfirmed) {
    setShowConfirmModal(false);

    if (isConfirmed) {
      try {
        const response = await fetch(
          API_URL + "/api/queue/" + itemToDelete.queue_id,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (response.ok) {
          setQueue((prevQueue) => {
            return prevQueue.filter((queue) => {
              return queue.queue_id !== itemToDelete.queue_id;
            });
          });
          console.log("Delete successful.");
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <main id="queue-page">
      {showConfirmModal && (
        <ConfirmDelete
          deleteFrom={"queue"}
          name={itemToDelete.name}
          vehicle={itemToDelete.vehicle}
          confirmDelete={handleDeleteConfirm}
        />
      )}
      <table id="queue-table">
        <caption>Queue:</caption>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {queue.map((q, index) => {
            return (
              <tr key={q.queue_id}>
                <td>{index + 1}</td>
                <td>{q.customer_name}</td>
                <td>{q.customer_vehicle}</td>
                <td>{q.type}</td>
                <td>{q.service_bought}</td>
                <td>₱ {q.total_amount}</td>
                <td>{q.status}</td>
                <td>{q.staff_assigned}</td>
                <td className="actions-container">
                  <button className="action-button">
                    <FaEdit size={16} />
                  </button>
                  <button
                    className="action-button"
                    onClick={() =>
                      handleDeleteClick(
                        q.queue_id,
                        q.customer_name,
                        q.customer_vehicle
                      )
                    }
                  >
                    <MdDelete color="red" size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}

export default QueuePage;
