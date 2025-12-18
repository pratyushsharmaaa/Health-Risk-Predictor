export default function Modal({ show, onClose, children }) {
  if (!show) return null
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="float-right text-gray-600" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  )
}
