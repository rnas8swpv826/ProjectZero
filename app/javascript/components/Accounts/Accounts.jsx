import React, { useEffect, useState, useReducer } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import useHttpRequest from '../hooks/useHttpRequest';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [adding, setAdding] = useState(true);
  const [messages, setMessages] = useState([]);

  // ---- Manage name and id state of each account ----
  const initAccount = { name: '', id: '' };

  const accountReducer = (state, action) => {
    if (action.type === 'INPUT') {
      return { name: action.value };
    } if (action.type === 'RESET') {
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
  const successfulAddUpdateAccount = () => {
    loadAccounts.sendRequest();
    dispatchAccount({ type: 'RESET' });
    setAdding(true);
  };

  const addAccount = useHttpRequest(
    { url: 'api/accounts', method: 'POST', body: { name: account.name } },
    successfulAddUpdateAccount,
  );

  useEffect(() => {
    setMessages(addAccount.errors);
  }, [addAccount.errors]);
  // ------------

  return (
    <div className="container mt-3">
      <h2 className="mb-3">Add a New Account</h2>
      <h6>Name</h6>
      <input
        className="form-control mb-3"
        type="text"
        name="name"
        onChange={(event) => dispatchAccount({ type: 'INPUT', value: event.target.value })}
        value={account.name}
      />
      <h6 className="text-danger">{messages.join('. ')}</h6>
      {adding
          && (
          <button type="button" className="btn btn-primary mb-3 mr-2" onClick={() => addAccount.sendRequest()}>
            Add Account
          </button>
          )}
      <Link to="/" className="btn btn-outline-primary mb-3 mr-2">Back to Home</Link>
      <Link to="/transactions" className="btn btn-outline-primary mb-3">Back to Transactions</Link>

      <h2>Existing Accounts</h2>
      {accounts.map((item) => (
        <div key={item.id} className="container">
          <div className="row">
            <div className="col-sm-3">
              <span>{item.name}</span>
            </div>
            <div className="col-sm-3">
              <button type="button" className="btn btn-link rename-delete-btn">
                {/* Add onClick */}
                Rename
              </button>
            </div>
            <div className="col-sm-3">
              <button type="button" className="btn btn-link rename-delete-btn">
                {/* Add onClick */}
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accounts;
