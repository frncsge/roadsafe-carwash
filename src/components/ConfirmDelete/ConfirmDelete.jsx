import { AiOutlineWarning } from "react-icons/ai";

function ConfirmDelete({ deleteFrom, name, vehicle, confirmDelete }) {
  return (
    <div id="modal-backdrop" onClick={() => confirmDelete(false)}>
      <div id="confirm-delete-modal" onClick={(e) => e.stopPropagation()}>
        <AiOutlineWarning color="#db2b2b" size={60} />
        <h1>Are you sure?</h1>
        <p id="delete-modal-message">
          {deleteFrom === "queue" && (
            <>
              You are about to delete <strong>{vehicle}</strong> owned by{" "}
              <strong>{name}</strong> from the queue list.
            </>
          )}
          {deleteFrom === "staff" && (
            <>
              You are about to delete <strong>{name}</strong> from the staff
              list.
            </>
          )}
        </p>
        <div id="delete-modal-button-container">
          <button className="delete-modal-button" onClick={() => confirmDelete(false)}>
            No, cancel
          </button>
          <button className="delete-modal-button" onClick={() => confirmDelete(true)}>
            Yes, I'm sure
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDelete;
