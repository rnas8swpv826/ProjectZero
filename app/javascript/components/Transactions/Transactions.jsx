import React, { useEffect, useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import useHttpRequest from '../hooks/useHttpRequest';
import TransactionsTable from './TransactionsTable';
import ButtonsAndErrors from './ButtonsAndErrors';

const Transactions = () => {
  // Table Data
  const [transactions, setTransactions] = useState([]);
  const [transactionId, setTransactionId] = useState('');
  const [date, setDate] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [payee, setPayee] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryId, setSubcategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [amountOut, setAmountOut] = useState('');
  // Other States
  const [messages, setMessages] = useState([]);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  // ---- Load Transactions, Accounts and Categories ----
  const loadTransactions = useHttpRequest(
    { url: '/api/transactions' },
    (data) => setTransactions(data),
  );

  const getAccountsData = (data) => {
    let firstAccount = '';
    if (data.length > 0) {
      firstAccount = data[0].id;
    }
    setAccountId(firstAccount);
    setAccounts(data);
  };

  const loadAccounts = useHttpRequest(
    { url: 'api/accounts' },
    getAccountsData,
  );

  const getCategoriesData = (data) => {
    const cat = [];
    const subcat = [];
    data.forEach((category) => {
      if (category.parent_id == null) {
        cat.push(category);
      } else {
        subcat.push(category);
      }
    });
    let firstCategory = '';
    if (cat.length > 0) {
      firstCategory = cat[0].id;
    }
    let firstSubcategory = '';
    if (subcat.length > 0) {
      firstSubcategory = subcat[0].id;
    }
    setCategories(cat);
    setSubcategories(subcat);
    setCategoryId(firstCategory);
    setSubcategoryId(firstSubcategory);
  };

  const loadCategories = useHttpRequest(
    { url: 'api/categories' },
    getCategoriesData,
  );

  useEffect(() => {
    loadTransactions.sendRequest();
    loadAccounts.sendRequest();
    loadCategories.sendRequest();
  }, []);
  // ------------

  // ---- Reset transaction in memory after successful request or cancellation ----
  const resetTxInMemory = () => {
    setMessages([]);
    setTransactionId('');
    setDate('');
    setAccountId('');
    setPayee('');
    setDescription('');
    setAmountOut('');
    loadAccounts.sendRequest();
    loadCategories.sendRequest();
  };
  // ------------

  // ---- Add or Update Transaction -----
  const addTransactionHandler = () => {
    setAdding(true);
    setUpdating(false);
    setDeleting(false);
    resetTxInMemory();
  };

  const bodyRequest = {
    transaction_date: date,
    account_id: accountId,
    payee,
    category_id: subcategoryId,
    description,
    amount_out: amountOut,
  };

  const successfulAddUpdateTransaction = () => {
    loadTransactions.sendRequest();
    resetTxInMemory();
    setAdding(false);
    setUpdating(false);
  };

  const addTransaction = useHttpRequest(
    { url: '/api/transactions', method: 'POST', body: bodyRequest },
    successfulAddUpdateTransaction,
  );

  const updateTransaction = useHttpRequest(
    { url: `/api/transactions/${transactionId}`, method: 'PATCH', body: bodyRequest },
    successfulAddUpdateTransaction,
  );

  useEffect(() => {
    setMessages(addTransaction.errors);
  }, [addTransaction.errors]);

  useEffect(() => {
    setMessages(updateTransaction.errors);
  }, [updateTransaction.errors]);
  // Sets error messages if transaction adding or updating is not sucessful.
  // The adding, updating & table data states remain unchanged
  // so that the user can correct the issue.
  // ------------

  // ---- Update Transaction
  const updatingHandler = (active, transaction) => {
    if (active) {
      setUpdating(true);
      setAdding(false);
      setDeleting(false);
      setMessages([]);
      setTransactionId(transaction.id);
      setDate(transaction.transaction_date);
      setAccountId(transaction.account_id);
      setPayee(transaction.payee);
      setCategoryId(transaction.category_id);
      setSubcategoryId(transaction.subcategory_id);
      setDescription(transaction.description);
      setAmountOut(transaction.amount_out);
    }
  };
  // ------------

  // ---- Delete Transactions ----
  const deleteTransactionsHandler = () => {
    setDeleting(true);
    setAdding(false);
    setUpdating(false);
    setMessages([]);
  };

  const selectRowsHandler = (idOfChecked) => {
    if (!selectedRows.includes(idOfChecked)) {
      setSelectedRows((prevState) => [...prevState, idOfChecked]);
      // Add id associated with checkbox only if it's not already checked
    } else {
      setSelectedRows((prevState) => prevState.filter((id) => id !== idOfChecked));
      // Remove id when the checkbox is selected a second time (i.e. unchecked)
    }
  };

  const bodyDeleteRequest = { selected_rows: selectedRows };

  const successfulDeleteTransaction = () => {
    setDeleting(false);
    loadTransactions.sendRequest();
    resetTxInMemory();
  };

  const deleteTransactions = useHttpRequest(
    { url: '/api/transactions', method: 'DELETE', body: bodyDeleteRequest },
    successfulDeleteTransaction,
  );
  // ------------

  // ---- Save and Cancel Button Handlers ----

  const cancelClickHandler = () => {
    if (adding) {
      setAdding(false);
      resetTxInMemory();
    } else if (updating) {
      setUpdating(false);
      resetTxInMemory();
    } else if (deleting) {
      setDeleting(false);
      setSelectedRows([]);
      setMessages([]);
    }
  };

  const saveClickHandler = () => {
    if (adding) {
      addTransaction.sendRequest();
    } else if (updating) {
      updateTransaction.sendRequest();
    } else if (deleting) {
      if (selectedRows.length === 0) {
        setMessages(['No transactions selected']);
      } else {
        deleteTransactions.sendRequest();
        setMessages([]);
        setDeleting(false);
      }
    }
  };
  // ------------

  // ---- Set state after input or select in table ----
  const onChangeHandler = (event) => {
    if (event.target.name === 'date') {
      setDate(event.target.value);
    } else if (event.target.name === 'accountId') {
      setAccountId(event.target.value);
    } else if (event.target.name === 'payee') {
      setPayee(event.target.value);
    } else if (event.target.name === 'categoryId') {
      setCategoryId(event.target.value);
      const newSubcategorylist = subcategories.filter(
        // eslint-disable-next-line eqeqeq
        (subcategory) => subcategory.parent_id == [event.target.value],
      );
      setSubcategoryId(newSubcategorylist[0].id);
    } else if (event.target.name === 'subcategoryId') {
      setSubcategoryId(event.target.value);
    } else if (event.target.name === 'description') {
      setDescription(event.target.value);
    } else if (event.target.name === 'amountOut') {
      setAmountOut(event.target.value);
    }
  };

  // ------------

  return (
    <div className="container">
      <h1 id="top">Transactions</h1>
      <button
        type="button"
        className="btn btn-primary mb-3 mr-2"
        onClick={addTransactionHandler}
      >
        Add Transaction
      </button>
      <button
        type="button"
        className="btn btn-outline-danger mb-3 mr-2"
        onClick={deleteTransactionsHandler}
      >
        Delete Transactions
      </button>
      <Link to="/" className="btn btn-outline-primary mb-3">Back to Home</Link>
      {loadTransactions.isLoading && <p>Transactions are loading.</p>}
      {transactions.length > 0 && !loadTransactions.isLoading
        ? (
          <TransactionsTable
            transactions={transactions}
            transactionId={transactionId}
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
            adding={adding}
            updating={updating}
            deleting={deleting}
            onCheckboxChange={selectRowsHandler}
            onChange={onChangeHandler}
            onUpdating={updatingHandler}
          />
        )
        : <p>No transactions to show.</p>}
      {(adding || deleting || updating) && (
      <ButtonsAndErrors
        messages={messages}
        onSaveClick={saveClickHandler}
        onCancelClick={cancelClickHandler}
      />
      )}
      <Link to="#top">Scroll to top</Link>
    </div>
  );
};

export default Transactions;
