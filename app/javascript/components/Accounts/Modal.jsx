import React from 'react';

const Modal = (props) => {
  const { name, onDeleteConfirmation } = props;

  return (
    <div className="modal fade" id="deleteConfirmation" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmation required</h5>
          </div>
          <div className="modal-body">
            <p>
              Are you sure you want to delete {name}?
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button type="button" className="btn btn-primary" onClick={onDeleteConfirmation}>Yes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
