import React from 'react';

const TransactionsTable = (props) => {
  const {
    transactions,
    transactionId,
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
    updating,
    deleting,
    onChange,
  } = props;

  // Send data on transaction to be updated to Transactions component
  const update = (transaction) => {
    props.onUpdating(true, transaction);
  };

  // Send transactions selected to Transactions component
  const checkboxHandler = (event) => {
    props.onCheckboxChange(event.target.value);
  };

  // Input and select cells for table
  const dateInputCell = (
    <td className="date-cell">
      <input type="date" name="date" className="date-input" value={date} onChange={onChange} />
    </td>
  );

  const accountSelectCell = (
    <td className="account-cell">
      <select name="accountId" className="account-select custom-select-sm" value={accountId} onChange={onChange}>
        {accounts.map((account) => (
          <option value={account.id} key={account.id}>{account.name}</option>
        ))}
      </select>
    </td>
  );

  const payeeInputCell = (
    <td className="payee-cell">
      <input type="text" name="payee" className="payee-input" value={payee} onChange={onChange} />
    </td>
  );

  const categorySelectCell = (
    <td className="category-cell">
      <select name="categoryId" className="category-select custom-select-sm" value={categoryId} onChange={onChange}>
        {categories.map((category) => (
          <option value={category.id} key={category.id}>{category.name}</option>
        ))}
      </select>
    </td>
  );

  const subcategorySelectCell = (
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
  );

  const descriptionInputCell = (
    <td className="description-cell">
      <input type="text" name="description" className="description-input" value={description} onChange={onChange} />
    </td>
  );

  const amountOutInputCell = (
    <td className="amount-out-cell">
      <input type="text" name="amountOut" className="amount-out-input" value={amountOut} onChange={onChange} />
    </td>
  );
  // ------------

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
            {(updating && transactionId === transaction.id)
              ? dateInputCell
              : <td className="date-cell" onClick={() => update(transaction)}>{transaction.transaction_date}</td>}
            {(updating && transactionId === transaction.id)
              ? accountSelectCell
              : <td className="account-cell" onClick={() => update(transaction)}>{transaction.account_name}</td>}
            {(updating && transactionId === transaction.id)
              ? payeeInputCell
              : <td className="payee-cell" onClick={() => update(transaction)}>{transaction.payee}</td>}
            {(updating && transactionId === transaction.id)
              ? categorySelectCell
              : <td className="category-cell" onClick={() => update(transaction)}>{transaction.category_name}</td>}
            {(updating && transactionId === transaction.id)
              ? subcategorySelectCell
              : <td className="category-cell" onClick={() => update(transaction)}>{transaction.subcategory_name}</td>}
            {(updating && transactionId === transaction.id)
              ? descriptionInputCell
              : <td className="description-cell" onClick={() => update(transaction)}>{transaction.description}</td>}
            {(updating && transactionId === transaction.id)
              ? amountOutInputCell
              : <td className="amount-out-cell" onClick={() => update(transaction)}>{transaction.amount_out}</td>}
          </tr>
        ))}
        {adding
          && (
          <tr>
            {dateInputCell}
            {accountSelectCell}
            {payeeInputCell}
            {categorySelectCell}
            {subcategorySelectCell}
            {descriptionInputCell}
            {amountOutInputCell}
          </tr>
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

export default TransactionsTable;
