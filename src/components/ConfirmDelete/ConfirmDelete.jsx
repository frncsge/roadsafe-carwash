function ConfirmDelete({ deleteFrom, name, vehicle, confirmDelete }) {
  const queueDeleteMessage = `You are about to delete ${vehicle} owned by ${name} from the queue list.`;
  const staffDeleteMessage = `You are about to delete ${name} from the staff list.`;

  return (
    <div id="confirm-delete-modal">
      <h1>CONFIRM DELETE</h1>
      <p>
        {deleteFrom === "queue"
          ? queueDeleteMessage
          : deleteFrom === "staff"
          ? staffDeleteMessage
          : null}
      </p>
      <div id="modal-button-container">
        <button className="modal-button" onClick={() => confirmDelete(true)}>Proceed</button>
        <button className="modal-button" onClick={() => confirmDelete(false)}>Discard</button>
      </div>
    </div>
  );
}

export default ConfirmDelete;
