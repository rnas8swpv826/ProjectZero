import React, { useEffect, useState } from 'react';
import useHttpRequest from '../hooks/useHttpRequest';
import TransactionsTable from './TransactionsTable';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  // ---- Load Transactions ----
  const { isLoading, error, sendRequest: loadTransactions } = useHttpRequest(
    { url: '/api/transactions' },
    (data) => setTransactions(data),
  );

  useEffect(() => {
    loadTransactions();
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
      {isLoading && <p>Transactions are loading.</p>}
      {transactions.length > 0 && !isLoading
        ? (
          <TransactionsTable
            transactions={transactions}
            deleting={deleting}
            onCheckboxChange={selectRowsHandler}
          />
        )
        : <p>No transactions to show.</p>}
      {error}
    </div>
  );
};

export default Transactions;
