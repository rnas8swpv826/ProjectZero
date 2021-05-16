import React, { useEffect, useState } from 'react';
import useHttpRequest from '../hooks/useHttpRequest';
import TransactionsTable from './TransactionsTable';
import ButtonsAndErrors from './ButtonsAndErrors';

const Transactions = () => {
  // Table Data
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryId, setSubcategoryId] = useState('');
  // Other States
  const [messages, setMessages] = useState([]);
  const [adding, setAdding] = useState(false);
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
    setCategories(cat);
    setSubcategories(subcat);
    setCategoryId(firstCategory);
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

  // ---- Add Transaction -----
  const addTransactionHandler = () => {
    setAdding(true);
    setDeleting(false);
    setMessages([]);
  };
  // ------------

  // ---- Delete Transactions ----
  const deleteTransactionsHandler = () => {
    setDeleting(true);
    setAdding(false);
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

  const body = { selected_rows: selectedRows };

  const deleteTransactions = useHttpRequest(
    { url: '/api/transactions', method: 'DELETE', body },
    (response) => setMessages([response.data]),
  );
  // ------------

  // ---- Save and Cancel Button Handlers ----
  const cancelClickHandler = () => {
    if (adding) {
      setAdding(false);
      setMessages([]);
    } else if (deleting) {
      setDeleting(false);
      setSelectedRows([]);
      setMessages([]);
    }
  };

  const saveClickHandler = () => {
    if (adding) {
      console.log('Adding a transaction. To be completed');
    } else if (deleting) {
      if (selectedRows.length === 0) {
        setMessages(['No transactions selected']);
      } else {
        deleteTransactions.sendRequest();
        loadTransactions.sendRequest();
        setMessages([]);
        setDeleting(false);
      }
    }
  };
  // ------------

  // ---- Set state after selecting dropdown option in table ----
  const onChangeHandler = (event) => {
    if (event.target.name === 'accountId') {
      setAccountId(event.target.value);
    } else if (event.target.name === 'categoryId') {
      setCategoryId(event.target.value);
    } else if (event.target.name === 'subcategoryId') {
      setSubcategoryId(event.target.value);
    }
  };
  // ------------

  return (
    <div className="container">
      <h1>Transactions</h1>
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
      {loadTransactions.isLoading && <p>Transactions are loading.</p>}
      {transactions.length > 0 && !loadTransactions.isLoading
        ? (
          <TransactionsTable
            transactions={transactions}
            accounts={accounts}
            accountId={accountId}
            categories={categories}
            categoryId={categoryId}
            subcategories={subcategories}
            subcategoryId={subcategoryId}
            adding={adding}
            deleting={deleting}
            onCheckboxChange={selectRowsHandler}
            onChange={onChangeHandler}
          />
        )
        : <p>No transactions to show.</p>}
      {(deleting || adding) && (
      <ButtonsAndErrors
        messages={messages}
        onSaveClick={saveClickHandler}
        onCancelClick={cancelClickHandler}
      />
      )}
    </div>
  );
};

export default Transactions;
