import React from 'react';
import '../styles.css';

const TransactionsTable = (props) => {
  const { transactions, deleting } = props;

  const checkboxHandler = (event) => {
    props.onCheckboxChange(event.target.value);
  };

  return (
    <table>
      <thead>
        <tr>
          {deleting && <th> </th>}
          <TableHeader />
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.id}>
            {deleting
              && (
                <td>
                  <input type="checkbox" value={transaction.id} onChange={checkboxHandler} />
                </td>
              )}
            <td className="date-cell">{transaction.transaction_date}</td>
            <td className="account-cell">{transaction.account_name}</td>
            <td className="payee-cell">{transaction.payee}</td>
            <td className="category-cell">{transaction.category_name}</td>
            <td className="category-cell">{transaction.subcategory_name}</td>
            <td className="description-cell">{transaction.description}</td>
            <td className="amount-out-cell">{transaction.amount_out}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const TableHeader = () => (
  <>
    <th className="date-cell">Date</th>
    <th className="account-cell">Account</th>
    <th className="payee-cell">Payee</th>
    <th className="category-cell">Category</th>
    <th className="category-cell">Subcategory</th>
    <th className="description-cell">Description</th>
    <th className="amount-out-cell">Amount Out</th>
  </>
);

export default TransactionsTable;
