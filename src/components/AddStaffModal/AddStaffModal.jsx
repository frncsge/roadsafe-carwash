import { useState } from "react";
import { HiMiniUserGroup } from "react-icons/hi2";

function AddStaffModal({ confirmAdd }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("Available");

  function handleInput(event) {
    const inputType = event.target.id;
    const newInputValue = event.target.value;

    if (inputType === "first-name") setFirstName(newInputValue);

    if (inputType === "last-name") setLastName(newInputValue);

    if (inputType === "phone-number") setPhoneNumber(newInputValue);

    if (inputType === "status") setStatus(newInputValue);
  }

  function capitalizeLetter(string) {
    return string
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(API_URL + "/api/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: capitalizeLetter(firstName),
          last_name: capitalizeLetter(lastName),
          phone_number: phoneNumber,
          status,
        }),
        credentials: "include",
      });

      if (response.ok) {
        confirmAdd(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div id="add-staff-modal-backdrop">
      <form id="add-staff-form" onSubmit={handleFormSubmit}>
        <div className="add-staff-modal-title">
          <section className="add-staff-modal-title-section">
            <div className="icon">
              <HiMiniUserGroup color="white"/>
            </div>
          </section>
          <section className="add-staff-modal-title-section">
            <span>Add New Staff</span>
            <p>Enter new staff information</p>
          </section>
        </div>
        <section className="add-staff-modal-input-section">
          <div className="add-staff-modal-input-group">
            <label htmlFor="first-name">First Name</label>
            <input
              onChange={handleInput}
              type="text"
              name="first_name"
              id="first-name"
              placeholder="Juan"
              required
              value={firstName}
            />
          </div>
          <div className="add-staff-modal-input-group">
            <label htmlFor="last-name">Last Name</label>
            <input
              onChange={handleInput}
              type="text"
              name="last_name"
              id="last-name"
              placeholder="Dela Cruz"
              required
              value={lastName}
            />
          </div>
        </section>
        <section className="add-staff-modal-input-section">
          <div className="add-staff-modal-input-group">
            <label htmlFor="phone-number">Phone</label>
            <input
              onChange={handleInput}
              type="text"
              name="phone_number"
              id="phone-number"
              placeholder="ex. 09606121936"
              required
              value={phoneNumber}
              pattern="^09[0-9]{9}$"
              title="Phone number must start with 09 and be exactly 11 digits"
            />
          </div>
          <div className="add-staff-modal-input-group">
            <label htmlFor="status">Status</label>
            <select
              name="status"
              id="status"
              onChange={handleInput}
              value={status}
            >
              <option value="Available">Available</option>
              <option value="Off-Duty">Off-Duty</option>
            </select>
          </div>
        </section>
        <div id="add-staff-form-button-container">
          <button
            id="close-add-staff-modal-button"
            type="button"
            onClick={() => {
              confirmAdd(false);
            }}
          >
            Cancel
          </button>
          <input type="submit" value="Save" />
        </div>
      </form>
    </div>
  );
}

export default AddStaffModal;
