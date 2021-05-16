import React, { useEffect, useState } from 'react';
import useHttpRequest from '../hooks/useHttpRequest';
import TransactionsTable from './TransactionsTable';
import ButtonsAndErrors from './ButtonsAndErrors';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  // ---- Load Transactions ----
  const loadTransactions = useHttpRequest(
    { url: '/api/transactions' },
    (data) => setTransactions(data),
  );

  useEffect(() => {
    loadTransactions.sendRequest();
  }, []);
  // ------------

  // ---- Add Transaction -----
  const addTransactionHandler = () => {
    setAdding(true);
    setDeleting(false);
    setMessages([]);
  };
  // ------------

  // ---- Delete Transactions ----
  const deleteTransactionsHandler = () => {
    setDeleting(true);
    setAdding(false);
    setMessages([]);
  };

  const selectRowsHandler = (idOfChecked) => {
    if (!selectedRows.includes(idOfChecked)) {
      setSelectedRows((prevState) => [...prevState, idOfChecked]);
      // Add id associated with checkbox only if it's not already checked
    } else {
      setSelectedRows((prevState) => prevState.filter((id) => id !== idOfChecked));
      // Remove id when the checkbox is selected a second time (i.e. unchecked)
    }
  };

  const body = { selected_rows: selectedRows };

  const deleteTransactions = useHttpRequest(
    { url: '/api/transactions', method: 'DELETE', body },
    (response) => setMessages([response.data]),
  );
  // ------------

  // ---- Save and Cancel Button Handlers ----
  const cancelClickHandler = () => {
    if (adding) {
      setAdding(false);
      setMessages([]);
    } else if (deleting) {
      setDeleting(false);
      setSelectedRows([]);
      setMessages([]);
    }
  };

  const saveClickHandler = () => {
    if (adding) {
      console.log('Adding a transaction. To be completed');
    } else if (deleting) {
      if (selectedRows.length === 0) {
        setMessages(['No transactions selected']);
      } else {
        deleteTransactions.sendRequest();
        loadTransactions.sendRequest();
        setMessages([]);
        setDeleting(false);
      }
    }
  };
  // ------------

  return (
    <div className="container">
      <h1>Transactions</h1>
      <button
        type="button"
        className="btn btn-primary mb-3 mr-2"
        onClick={addTransactionHandler}
      >
        Add Transaction
      </button>
      <button
        type="button"
        className="btn btn-outline-danger mb-3 mr-2"
        onClick={deleteTransactionsHandler}
      >
        Delete Transactions
      </button>
      {loadTransactions.isLoading && <p>Transactions are loading.</p>}
      {transactions.length > 0 && !loadTransactions.isLoading
        ? (
          <TransactionsTable
            transactions={transactions}
            adding={adding}
            deleting={deleting}
            onCheckboxChange={selectRowsHandler}
          />
        )
        : <p>No transactions to show.</p>}
      {(deleting || adding) && (
      <ButtonsAndErrors
        messages={messages}
        onSaveClick={saveClickHandler}
        onCancelClick={cancelClickHandler}
      />
      )}
    </div>
  );
};

export default Transactions;
