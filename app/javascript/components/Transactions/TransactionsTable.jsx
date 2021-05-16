import React from 'react';
import '../styles.css';

const TransactionsTable = (props) => {
  const { transactions, adding, deleting } = props;

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
        {adding && <AddTransactionRow />}
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

const AddTransactionRow = () => (
  <tr>
    <td className="date-cell">
      <input type="date" name="transactionDate" className="date-input" />
    </td>
    <td className="account-cell">
      <input type="text" name="account" className="account-input" />
      {/* To be changed to add dropdown */}
    </td>
    <td className="payee-cell">
      <input type="text" name="payee" className="payee-input" />
    </td>
    <td className="category-cell">
      <input type="text" name="category" className="category-input" />
      {/* To be changed to add dropdown */}
    </td>
    <td className="category-cell">
      <input type="text" name="subcategory" className="category-input" />
      {/* To be changed to add dropdown */}
    </td>
    <td className="description-cell">
      <input type="text" name="description" className="description-input" />
    </td>
    <td className="amount-out-cell">
      <input type="text" name="amountOut" className="amount-out-input" />
    </td>
  </tr>
);

export default TransactionsTable;
