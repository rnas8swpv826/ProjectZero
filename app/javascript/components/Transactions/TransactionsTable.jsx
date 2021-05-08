import React from 'react';
import '../styles.css';

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
      <th className="date-cell">Date</th>
      <th className="account-cell">Account</th>
      <th className="payee-cell">Payee</th>
      <th className="category-cell">Category</th>
      <th className="category-cell">Subcategory</th>
      <th className="description-cell">Description</th>
      <th className="amount-out-cell">Amount Out</th>
    </tr>
  </thead>
);

const TableRows = (props) => {
  const { transactions } = props;

  return (
    transactions.map((transaction) => (
      <tr key={transaction.id}>
        <td className="date-cell">{transaction.transaction_date}</td>
        <td className="account-cell">{transaction.account_name}</td>
        <td className="payee-cell">{transaction.payee}</td>
        <td className="category-cell">{transaction.category_name}</td>
        <td className="category-cell">{transaction.subcategory_name}</td>
        <td className="description-cell">{transaction.description}</td>
        <td className="amount-out-cell">{transaction.amount_out}</td>
      </tr>
    ))
  );
};

export default TransactionsTable;
