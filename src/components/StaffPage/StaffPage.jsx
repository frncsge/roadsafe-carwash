import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import ConfirmDelete from "../ConfirmDelete/ConfirmDelete";
import AddStaffModal from "../AddStaffModal/AddStaffModal";
import ToastNotification from "../ToastNotification/ToastNotification";

function StaffPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [staff, setStaff] = useState(null);
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [toasts, setToasts] = useState([]);

  async function fetchStaff() {
    try {
      const response = await fetch(API_URL + "/api/staff", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const staffObject = await response.json();
        setStaff(staffObject);
        console.log(staffObject);
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

  useEffect(() => {
    fetchStaff();
  }, []);

  if (isLoadingStaff) {
    return <LoadingScreen />;
  }

  if (!staff) {
    return <Navigate to="/admin/login" />;
  }

  function handleDeleteClick(staff_id, name) {
    setStaffToDelete({ staff_id, name });
    setShowDeleteModal(true);
  }

  async function handleDeleteConfirm(isConfirmed) {
    setShowDeleteModal(false);

    if (isConfirmed) {
      try {
        //delete staff
        const response = await fetch(
          API_URL + "/api/staff/" + staffToDelete.staff_id,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (response.ok) {
          //update staff state to exclude deleted staff
          setStaff((prevStaff) => {
            return prevStaff.filter((staff) => {
              return staff.staff_id !== staffToDelete.staff_id;
            });
          });

          showToast("delete", null);
        } else if (response.status === 409) {
          //if error like fk constraint
          showToast("delete", true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  function handleAddStaffClick() {
    setShowAddStaffModal(true);
  }

  function handleAddConfirm(isConfirmed) {
    setShowAddStaffModal(false);

    if (isConfirmed) {
      fetchStaff();
      //show toast if staff is not null
      if (staff) {
        showToast("add", null);
      }
    }
  }

  function showToast(operation, error) {
    const toastId = Date.now();
    const newToast = {
      toastId,
      operation,
      error,
      show: true,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    closeToast(toastId, error, false);
  }

  function closeToast(toastId, error, immediate) {
    //set show to false first before removing entirely from the DOM to make the out animation visible
    if (immediate) {
      setToasts((prevToasts) => {
        return prevToasts.map((prevToast) => {
          return prevToast.toastId === toastId
            ? { ...prevToast, show: false }
            : prevToast;
        });
      });

      //remove from the DOM after 0.5 seconds based on the transition/animation from the css file...
      setTimeout(() => {
        setToasts((prevToasts) => {
          return prevToasts.filter((prevToast) => prevToast.toastId != toastId);
        });
      }, 500);

      return;
    }

    setTimeout(
      () => {
        setToasts((prevToasts) => {
          return prevToasts.map((prevToast) => {
            return prevToast.toastId === toastId
              ? { ...prevToast, show: false }
              : prevToast;
          });
        });
      },
      error ? 8000 : 5000
    );

    //remove from the DOM after 8 or 5 seconds...
    setTimeout(() => {
      setToasts((prevToasts) => {
        return prevToasts.filter((prevToast) => prevToast.toastId != toastId);
      });
    }, (error ? 8000 : 5000) + 500);
  }

  return (
    <main id="staff-page">
      {showDeleteModal && (
        <ConfirmDelete
          deleteFrom={"staff"}
          name={staffToDelete.name}
          vehicle={null}
          confirmDelete={handleDeleteConfirm}
        />
      )}
      {showAddStaffModal && <AddStaffModal confirmAdd={handleAddConfirm} />}
      <table id="staff-table">
        <caption>Staff:</caption>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone number</th>
            <th>Status</th>
            <th>Assigned to</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => {
            return (
              <tr key={s.staff_id}>
                <td>{s.full_name}</td>
                <td>{s.phone_number}</td>
                <td>{s.status}</td>
                <td>{s.assigned_to}</td>
                <td className="actions-container">
                  <button className="action-button">
                    <FaEdit size={16} />
                  </button>
                  <button
                    className="action-button"
                    onClick={() => handleDeleteClick(s.staff_id, s.full_name)}
                  >
                    <MdDelete color="red" size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5}>
              <button id="add-staff-button" onClick={handleAddStaffClick}>
                Add Staff
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
      <div id="toast-notif-container">
        {toasts.map((toast) => {
          return (
            <ToastNotification
              key={toast.toastId}
              operation={toast.operation}
              entity={"staff"}
              show={toast.show}
              close={() => {
                closeToast(toast.toastId, toast.error, true);
              }}
              error={toast.error}
            />
          );
        })}
      </div>
    </main>
  );
}

export default StaffPage;
