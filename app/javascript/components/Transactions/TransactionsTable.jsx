import React from 'react';
import '../styles.css';

const TransactionsTable = (props) => {
  const {
    transactions,
    date,
    accounts,
    accountId,
    payee,
    categories,
    categoryId,
    subcategories,
    subcategoryId,
    description,
    amountOut,
    adding,
    deleting,
    onChange,
  } = props;

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
        {adding
          && (
          <AddTransactionRow
            date={date}
            accounts={accounts}
            accountId={accountId}
            payee={payee}
            categories={categories}
            categoryId={categoryId}
            subcategories={subcategories}
            subcategoryId={subcategoryId}
            description={description}
            amountOut={amountOut}
            onChange={onChange}
          />
          )}
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

const AddTransactionRow = (props) => {
  const {
    date,
    accounts,
    accountId,
    payee,
    categories,
    categoryId,
    subcategories,
    subcategoryId,
    description,
    amountOut,
    onChange,
  } = props;

  return (
    <tr>
      <td className="date-cell">
        <input type="date" name="date" className="date-input" value={date} onChange={onChange} />
      </td>
      <td className="account-cell">
        <select name="accountId" className="account-select custom-select-sm" value={accountId} onChange={onChange}>
          {accounts.map((account) => (
            <option value={account.id} key={account.id}>{account.name}</option>
          ))}
        </select>
      </td>
      <td className="payee-cell">
        <input type="text" name="payee" className="payee-input" value={payee} onChange={onChange} />
      </td>
      <td className="category-cell">
        <select name="categoryId" className="category-select custom-select-sm" value={categoryId} onChange={onChange}>
          {categories.map((category) => (
            <option value={category.id} key={category.id}>{category.name}</option>
          ))}
        </select>
      </td>
      <td className="category-cell">
        <select
          name="subcategoryId"
          className="category-select custom-select-sm"
          value={subcategoryId}
          onChange={onChange}
        >
          {subcategories.map((subcategory) => (
            // eslint-disable-next-line eqeqeq
            (subcategory.parent_id == categoryId)
            && <option value={subcategory.id} key={subcategory.id}>{subcategory.name}</option>
          ))}
        </select>
      </td>
      <td className="description-cell">
        <input type="text" name="description" className="description-input" value={description} onChange={onChange} />
      </td>
      <td className="amount-out-cell">
        <input type="text" name="amountOut" className="amount-out-input" value={amountOut} onChange={onChange} />
      </td>
    </tr>
  );
};

export default TransactionsTable;
