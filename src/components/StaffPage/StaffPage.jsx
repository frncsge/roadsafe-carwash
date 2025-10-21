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
  const [toast, setToast] = useState({
    operation: "",
    show: false,
    error: null,
  });

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
        const response = await fetch(
          API_URL + "/api/staff/" + staffToDelete.staff_id,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (response.ok) {
          setStaff((prevStaff) => {
            return prevStaff.filter((staff) => {
              return staff.staff_id !== staffToDelete.staff_id;
            });
          });

          setToast((prevToast) => ({
            ...prevToast,
            operation: "delete",
            show: true,
          }));

          //remove notif after 5 secs
          setTimeout(() => {
            setToast((prevToast) => ({
              ...prevToast,
              show: false,
            }));
          }, 5000);

          console.log("Delete successful.");
        } else if (response.status === 409) {
          //if error like fk constraint
          setToast((prevToast) => ({
            ...prevToast,
            operation: "delete",
            show: true,
            error: true,
          }));

          //remove notif after 5 secs
          setTimeout(() => {
            setToast((prevToast) => ({
              ...prevToast,
              show: false,
              error: null,
            }));
          }, 8000);
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
        setToast((prevToast) => ({
          ...prevToast,
          operation: "add",
          show: true,
        }));

        //remove notif after 5 secs
        setTimeout(() => {
          setToast((prevToast) => ({
            ...prevToast,
            show: false,
          }));
        }, 5000);
      }
    }
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
      <ToastNotification
        operation={toast.operation}
        entity={"staff"}
        show={toast.show}
        close={() => {
          setToast((prevToast) => ({
            ...prevToast,
            show: false,
          }));

          return toast.show;
        }}
        error={toast.error}
      />
    </main>
  );
}

export default StaffPage;
