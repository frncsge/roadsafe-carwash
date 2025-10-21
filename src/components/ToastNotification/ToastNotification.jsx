import { MdClose } from "react-icons/md";

function ToastNotification({ operation, entity, show, close, error }) {
  return (
    <div id="toast-notif" className={show ? "show" : ""}>
      {operation === "add" && (
        <>
          <p className="toast-notif-message">
            A new {entity} is added successfully.
          </p>
        </>
      )}
      {operation === "delete" && (
        <>
          {error ? (
            <p className="toast-notif-message">
              Can't delete {entity} because its status is still working.
              Update to available or off-duty first
            </p>
          ) : (
            <p className="toast-notif-message">
              A {entity} is deleted successfully.
            </p>
          )}
        </>
      )}
      <MdClose
        className="toast-notif-close-button"
        size={40}
        color="rgb(24, 202, 24)"
        onClick={() => close()}
      />
    </div>
  );
}

export default ToastNotification;
