import React from 'react';

const ButtonsAndErrors = (props) => {
  const { messages, onCancelClick, onSaveClick } = props;

  return (
    <div className="mt-2">
      <button type="button" className="btn btn-primary btn-sm mr-1" onClick={onSaveClick}>Save</button>
      <button type="button" className="btn btn-secondary btn-sm" onClick={onCancelClick}>Cancel</button>
      <span className="text-danger">{messages.join('. ')}</span>
    </div>
  );
};

export default ButtonsAndErrors;
