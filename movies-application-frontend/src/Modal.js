import './App.css';

const Modal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        {children}
      </div>
    </div>
  );
}

export default Modal;
