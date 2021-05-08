import React, { useEffect, useState } from 'react';
import useHttpRequest from '../hooks/useHttpRequest';

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
    <div>
      <h1>Transactions</h1>
      {transactions.length > 0 && !isLoading
        ? <p>{transactions[0].payee}</p> : <p>No Transactions</p>}
      {error}
    </div>
  );
};

export default Transactions;
