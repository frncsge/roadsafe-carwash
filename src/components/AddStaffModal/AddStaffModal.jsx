import { useState } from "react";

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

  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(API_URL + "/api/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
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
        <label htmlFor="phone-number">Phone</label>
        <input
          onChange={handleInput}
          type="text"
          name="phone_number"
          id="phone-number"
          placeholder="ex. 09606121936"
          required
          value={phoneNumber}
        />
        <label htmlFor="status">Status</label>
        <select name="status" id="status" onChange={handleInput} value={status}>
          <option value="Available">Available</option>
          <option value="Off-Duty">Off-Duty</option>
        </select>
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
