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

  return (
    <div className="container">
      <h1>Transactions</h1>
      {isLoading && <p>Transactions are loading.</p>}
      {transactions.length > 0 && !isLoading
        ? <TransactionsTable transactions={transactions} /> : <p>No transactions to show.</p>}
      {error}
    </div>
  );
};

export default Transactions;
