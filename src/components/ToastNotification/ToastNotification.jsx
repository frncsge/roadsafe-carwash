import { MdClose } from 'react-icons/md';

function ToastNotification({operation, entity, show, close}) {
    return (
        <div id="toast-notif" className={show ? "show" : ""}>
            {operation === "add" && 
                <>
                    <p className="toast-notif-message">A new {entity} is added successfully.</p>
                    <MdClose className='toast-notif-close-button' size={40} color='rgb(24, 202, 24)' onClick={() => close()}/>
                </>
            }
        </div>
    )
}

export default ToastNotification;