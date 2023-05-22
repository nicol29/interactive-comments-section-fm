function Modal ({ manageModal, modalDeleteComment }) {
  return (
    <div className="modal-bg" onClick={() => manageModal(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Delete comment</h2>
        <p>Are your sure you want to delete this comment? This will remove the comment and can't be undone.</p>
        <div className="modal-actions">
          <button className="cancel-button" onClick={() => manageModal()}>NO, CANCEL</button>
          <button className="delete-button" onClick={() => modalDeleteComment()}>YES, DELETE</button>
        </div>
      </div>
    </div>
  )
}

export default Modal;