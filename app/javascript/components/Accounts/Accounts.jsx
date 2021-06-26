import React, { useEffect, useState, useReducer } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import $ from 'jquery'; // To remove Modal backdrop
import useHttpRequest from '../hooks/useHttpRequest';
import Modal from './Modal';
import Item from './Item';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [adding, setAdding] = useState(true);
  const [renaming, setRenaming] = useState(false);
  const [messages, setMessages] = useState([]);
  const [displayModal, setDisplayModal] = useState(false);

  // ---- Manage name and id state of each account ----
  const initAccount = { name: '', id: '' };

  const accountReducer = (state, action) => {
    if (action.type === 'INPUT') {
      return { name: action.value, id: state.id };
    } if (action.type === 'RENAME') {
      setRenaming(true);
      setAdding(false);
      return { name: action.value.name, id: action.value.id };
    } if (action.type === 'DELETE') {
      setDisplayModal(true);
      return { name: action.value.name, id: action.value.id };
    } if (action.type === 'RESET') {
      setAdding(true);
      setRenaming(false);
      return { name: '', id: '' };
    }
    return { name: '', id: '' };
  };

  const [account, dispatchAccount] = useReducer(accountReducer, initAccount);
  // ------------

  // ---- Load existing accounts ----
  const loadAccounts = useHttpRequest(
    { url: 'api/accounts' },
    (data) => setAccounts(data),
  );

  useEffect(() => {
    loadAccounts.sendRequest();
  }, []);
  // ------------

  // ---- Add new account ----
  const successfulAddRenameAccount = () => {
    loadAccounts.sendRequest();
    dispatchAccount({ type: 'RESET' });
  };

  const addAccount = useHttpRequest(
    { url: 'api/accounts', method: 'POST', body: account },
    successfulAddRenameAccount,
  );

  useEffect(() => {
    setMessages(addAccount.errors);
  }, [addAccount.errors]);
  // ------------

  // ---- Rename an existing account ----
  const cancelRenameHandler = () => {
    dispatchAccount({ type: 'RESET' });
  };

  const renameHandler = (item) => {
    dispatchAccount({ type: 'RENAME', value: item });
  };

  const renameAccount = useHttpRequest(
    { url: `/api/accounts/${account.id}`, method: 'PATCH', body: account },
    successfulAddRenameAccount,
  );

  useEffect(() => {
    setMessages(renameAccount.errors);
  }, [renameAccount.errors]);
  // ------------

  // ---- Delete an account ----
  const successfulDeleteAccount = () => {
    $('#deleteConfirmation').modal('hide'); // Remove Modal backdrop
    setDisplayModal(false);
    dispatchAccount({ type: 'RESET' });
    loadAccounts.sendRequest();
  };

  const deleteAccount = useHttpRequest(
    { url: `/api/accounts/${account.id}`, method: 'DELETE', body: account },
    successfulDeleteAccount,
  );

  const deleteHandler = (item) => {
    dispatchAccount({ type: 'DELETE', value: item });
  };
  // ------------

  return (
    <div className="container">
      {displayModal
        && (
        <Modal
          name={account.name}
          onDeleteConfirmation={() => deleteAccount.sendRequest()}
        />
        )}
      <h2>Add a New Account</h2>
      <h6>Name</h6>
      <input
        className="form-control"
        type="text"
        name="name"
        onChange={(event) => dispatchAccount({ type: 'INPUT', value: event.target.value })}
        value={(adding || renaming) ? account.name : null}
      />
      <h6 className="text-danger">{messages.join('. ')}</h6>
      {adding
        && (
        <button type="button" className="btn btn-primary" onClick={() => addAccount.sendRequest()}>
          Add Account
        </button>
        )}
      {renaming
        && (
          <>
            <button type="button" className="btn btn-primary" onClick={() => renameAccount.sendRequest()}>
              Save
            </button>
            <button type="button" className="btn btn-secondary" onClick={cancelRenameHandler}>
              Cancel
            </button>
          </>
        )}
      <Link to="/" className="btn btn-outline-primary">Back to Home</Link>
      <Link to="/transactions" className="btn btn-outline-primary">Back to Transactions</Link>

      <h2>Existing Accounts</h2>
      {accounts.map((item) => (
        <Item item={item} key={item.id} onRename={renameHandler} onDelete={deleteHandler} />
      ))}
    </div>
  );
};

export default Accounts;
