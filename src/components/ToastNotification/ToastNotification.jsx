import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

function ToastNotification({ operation, entity, show, close, error }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    //wait for 50ms after the mounting of the toast notif before adding the show class (animation)
    const timer = setTimeout(() => setVisible(true), 50);
    //clean up function
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="toast-notif"
      style={
        error
          ? {
              backgroundColor: "#d0090972",
              border: "1px solid #d00909",
            }
          : {
              backgroundColor: "rgba(24, 202, 24, 0.426)",
              border: "1px solid rgb(24, 202, 24)",
            }
      }
      className={visible && show ? "show" : ""}
    >
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
              Can't delete {entity} because its status is still working. Update
              to available or off-duty first
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
        color={error ? "#d00909" : "rgb(24, 202, 24)"}
        onClick={() => close()}
      />
    </div>
  );
}

export default ToastNotification;
