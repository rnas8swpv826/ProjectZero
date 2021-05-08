import React from 'react';

const TransactionsTable = (props) => {
  const { transactions } = props;

  return (
    <div>
      <table>
        <TableHeader />
        <tbody>
          <TableRows transactions={transactions} />
        </tbody>
      </table>
    </div>
  );
};

const TableHeader = () => (
  <thead>
    <tr>
      <th>Date</th>
      <th>Account</th>
      <th>Payee</th>
      <th>Category</th>
      <th>Subcategory</th>
      <th>Description</th>
      <th>Amount Out</th>
    </tr>
  </thead>
);

const TableRows = (props) => {
  const { transactions } = props;

  return (
    transactions.map((transaction) => (
      <tr key={transaction.id}>
        <td>{transaction.transaction_date}</td>
        <td>{transaction.account_name}</td>
        <td>{transaction.payee}</td>
        <td>{transaction.category_name}</td>
        <td>{transaction.subcategory_name}</td>
        <td>{transaction.description}</td>
        <td>{transaction.amount_out}</td>
      </tr>
    ))
  );
};

export default TransactionsTable;
