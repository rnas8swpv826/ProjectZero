import React from 'react';

const Item = (props) => {
  const { item, onRename, onDelete } = props;
  return (
    <div key={item.id} className="container">
      <div className="row">
        <div className="col-sm-3"><span>{item.name}</span></div>
        <div className="col-sm-3">
          <button type="button" className="btn btn-link rename-delete-btn" onClick={() => onRename(item)}>
            Rename
          </button>
        </div>
        <div className="col-sm-3">
          <button
            type="button"
            className="btn btn-link rename-delete-btn"
            data-toggle="modal"
            data-target="#deleteConfirmation"
            onClick={() => onDelete(item)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Item;
