import React, { useEffect, useState } from 'react';
import useHttpRequest from '../hooks/useHttpRequest';
import TransactionsTable from './TransactionsTable';
import ButtonsAndErrors from './ButtonsAndErrors';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [messages, setMessages] = useState([]);

  // ---- Load Transactions ----
  const loadTransactions = useHttpRequest(
    { url: '/api/transactions' },
    (data) => setTransactions(data),
  );

  useEffect(() => {
    loadTransactions.sendRequest();
  }, []);
  // ------------

  // ---- Delete Transactions ----
  const [deleting, setDeleting] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const selectRowsHandler = (idOfChecked) => {
    if (!selectedRows.includes(idOfChecked)) {
      setSelectedRows((prevState) => [...prevState, idOfChecked]);
      // Add id associated with checkbox only if it's not already checked
    } else {
      setSelectedRows((prevState) => prevState.filter((id) => id !== idOfChecked));
      // Remove id when the checkbox is selected a second time (i.e. unchecked)
    }
  };

  const cancelClickHandler = () => {
    if (deleting) {
      setDeleting(false);
      setSelectedRows([]);
      setMessages([]);
    }
  };

  const body = { selected_rows: selectedRows };

  const deleteTransactions = useHttpRequest(
    { url: '/api/transactions', method: 'DELETE', body },
    (response) => setMessages([response.data]),
  );

  const saveClickHandler = () => {
    if (selectedRows.length === 0) {
      setMessages(['No transactions selected']);
    } else {
      deleteTransactions.sendRequest();
      loadTransactions.sendRequest();
      setMessages([]);
      setDeleting(false);
    }
  };
  // ------------

  return (
    <div className="container">
      <h1>Transactions</h1>
      <button
        type="button"
        className="btn btn-outline-danger mb-3 mr-2"
        onClick={() => setDeleting(true)}
      >Delete Transactions
      </button>
      {loadTransactions.isLoading && <p>Transactions are loading.</p>}
      {transactions.length > 0 && !loadTransactions.isLoading
        ? (
          <TransactionsTable
            transactions={transactions}
            deleting={deleting}
            onCheckboxChange={selectRowsHandler}
          />
        )
        : <p>No transactions to show.</p>}
      {deleting && (
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
