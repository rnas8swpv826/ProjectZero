import React, {
  useEffect, useState, useReducer, useCallback,
} from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import useHttpRequest from '../hooks/useHttpRequest';
import TransactionsTable from './TransactionsTable';
import ButtonsAndErrors from './ButtonsAndErrors';

const Transactions = () => {
  // Table Data
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  // Other States
  const [messages, setMessages] = useState([]);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  // ---- Reducer for transaction (tx for short) ----
  const initTx = {
    transactionId: '',
    date: '',
    accountId: '',
    payee: '',
    categoryId: '',
    subcategoryId: '',
    description: '',
    amountOut: '',
  };

  const txReducer = (state, action) => {
    switch (action.type) {
      case 'INIT_ACCOUNT':
        return { ...state, accountId: action.value };
      case 'INIT_CATEGORY':
        return {
          ...state,
          categoryId: action.value.category,
          subcategoryId: action.value.subcategory,
        };
      case 'UPDATING_CLICK':
        return {
          transactionId: action.value.id,
          date: action.value.transaction_date,
          accountId: action.value.account_id,
          payee: action.value.payee,
          categoryId: action.value.category_id,
          subcategoryId: action.value.subcategory_id,
          description: action.value.description,
          amountOut: action.value.amount_out,
        };
      case 'DATE':
        return {
          ...state,
          date: action.value,
        };
      case 'ACCOUNT_ID':
        return {
          ...state,
          accountId: action.value,
        };
      case 'PAYEE':
        return {
          ...state,
          payee: action.value,
        };
      case 'CATEGORY_ID': {
        const newSubcategorylist = subcategories.filter(
          // eslint-disable-next-line eqeqeq
          (subcategory) => subcategory.parent_id == action.value,
        );
        return {
          ...state,
          categoryId: action.value,
          subcategoryId: newSubcategorylist[0].id,
        };
      }
      case 'SUBCATEGORY_ID':
        return {
          ...state,
          subcategoryId: action.value,
        };
      case 'DESCRIPTION':
        return {
          ...state,
          description: action.value,
        };
      case 'AMOUNT_OUT':
        return {
          ...state,
          amountOut: action.value,
        };
      case 'RESET':
        return {
          transactionId: '',
          date: '',
          accountId: '',
          payee: '',
          categoryId: '',
          subcategoryId: '',
          description: '',
          amountOut: '',
        };
      default:
        return {
          transactionId: '',
          date: '',
          accountId: '',
          payee: '',
          categoryId: '',
          subcategoryId: '',
          description: '',
          amountOut: '',
        };
    }
  };

  const [tx, dispatchTx] = useReducer(txReducer, initTx);
  // ------------

  // ---- Load Transactions, Accounts and Categories ----
  const { isLoading, errors, sendRequest } = useHttpRequest();

  const loadTransactions = useCallback(() => {
    sendRequest(
      { url: '/api/transactions' },
      (data) => setTransactions(data),
    );
  }, [sendRequest]);

  const loadAccounts = useCallback(() => {
    const getAccountsData = (data) => {
      let firstAccount = '';
      if (data.length > 0) {
        firstAccount = data[0].id;
      }
      dispatchTx({ type: 'INIT_ACCOUNT', value: firstAccount });
      setAccounts(data);
    };

    sendRequest(
      { url: 'api/accounts' },
      getAccountsData,
    );
  }, [sendRequest]);

  const loadCategories = useCallback(() => {
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
      dispatchTx({
        type: 'INIT_CATEGORY',
        value: { category: firstCategory, subcategory: firstSubcategory },
      });
    };

    sendRequest(
      { url: 'api/categories' },
      getCategoriesData,
    );
  }, [sendRequest]);

  useEffect(() => {
    loadTransactions();
    loadAccounts();
    loadCategories();
  }, [loadTransactions, loadAccounts, loadCategories]);
  // ------------

  // ---- Reset transaction in memory after successful request or cancellation ----
  const resetTxInMemory = () => {
    setMessages([]);
    dispatchTx({ type: 'RESET' });
    loadAccounts();
    loadCategories();
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
    transaction_date: tx.date,
    account_id: tx.accountId,
    payee: tx.payee,
    category_id: tx.subcategoryId,
    description: tx.description,
    amount_out: tx.amountOut,
  };

  const successfulAddUpdateTransaction = () => {
    loadTransactions();
    resetTxInMemory();
    setAdding(false);
    setUpdating(false);
  };

  const addTransaction = () => {
    sendRequest(
      { url: '/api/transactions', method: 'POST', body: bodyRequest },
      successfulAddUpdateTransaction,
    );
  };

  const updateTransaction = () => {
    sendRequest(
      { url: `/api/transactions/${tx.transactionId}`, method: 'PATCH', body: bodyRequest },
      successfulAddUpdateTransaction,
    );
  };

  useEffect(() => {
    setMessages(errors);
  }, [errors]);
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
      dispatchTx({ type: 'UPDATING_CLICK', value: transaction });
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
    loadTransactions();
    resetTxInMemory();
  };

  const deleteTransactions = () => {
    sendRequest(
      { url: '/api/transactions', method: 'DELETE', body: bodyDeleteRequest },
      successfulDeleteTransaction,
    );
  };
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
      addTransaction();
    } else if (updating) {
      updateTransaction();
    } else if (deleting) {
      if (selectedRows.length === 0) {
        setMessages(['No transactions selected']);
      } else {
        deleteTransactions();
        setMessages([]);
        setDeleting(false);
      }
    }
  };
  // ------------

  // ---- Set state after input or select in table ----
  const onChangeHandler = (event) => {
    dispatchTx({ type: event.target.name, value: event.target.value });
  };
  // ------------

  return (
    <div className="container">
      <h1 id="top">Transactions</h1>
      <button type="button" className="btn btn-primary" onClick={addTransactionHandler}>
        Add Transaction
      </button>
      <button type="button" className="btn btn-outline-danger" onClick={deleteTransactionsHandler}>
        Delete Transactions
      </button>
      <Link to="/" className="btn btn-outline-primary">Back to Home</Link>
      {isLoading && <p>Transactions are loading.</p>}
      {transactions.length > 0 && !isLoading
        ? (
          <TransactionsTable
            transactions={transactions}
            transactionId={tx.transactionId}
            date={tx.date}
            accounts={accounts}
            accountId={tx.accountId}
            payee={tx.payee}
            categories={categories}
            categoryId={tx.categoryId}
            subcategories={subcategories}
            subcategoryId={tx.subcategoryId}
            description={tx.description}
            amountOut={tx.amountOut}
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
