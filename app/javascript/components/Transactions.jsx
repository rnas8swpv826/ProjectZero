import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import './styles.css';

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      accounts: [],
      categories: [],
      subcategories: [],
      isLoaded: false,
      adding: false,
      deleting: false,
      transactionDate: '',
      accountId: '',
      payee: '',
      categoryId: '',
      subcategoryId: '',
      description: '',
      amountOut: '',
      messages: [],
      selectedRows: [],
      updating: false,
      transactionId: 0,
    };
    this.loadTransactions = this.loadTransactions.bind(this);
    this.loadAccounts = this.loadAccounts.bind(this);
    this.loadCategories = this.loadCategories.bind(this);
    this.addTransactionButton = this.addTransactionButton.bind(this);
    this.deleteTransactionButton = this.deleteTransactionButton.bind(this);
    this.addCancel = this.addCancel.bind(this);
    this.addSave = this.addSave.bind(this);
    this.deleteCancel = this.deleteCancel.bind(this);
    this.deleteSave = this.deleteSave.bind(this);
    this.updateCancel = this.updateCancel.bind(this);
    this.updateSave = this.updateSave.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.update = this.update.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  componentDidMount() { // Will load data before render runs
    this.loadTransactions();
    this.loadAccounts();
    this.loadCategories();
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onCheckboxChange(event) {
    const { selectedRows } = this.state;
    const { checked } = event.target;
    if (checked) {
      selectedRows.push(event.target.value);
    } else {
      const uncheckedIndex = selectedRows.indexOf(event.target.value);
      selectedRows.splice(uncheckedIndex, 1);
    }
    this.setState({ selectedRows });
  }

  loadTransactions() {
    const url = '/api/transactions';
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response error.');
      })
      .then((data) => {
        this.setState({ transactions: data, isLoaded: true });
      })
      .catch(() => {
        const { history } = this.props;
        history.push('/');
      }); // If an error is thrown, go back to homepage
  }

  loadAccounts() {
    const url = '/api/accounts';
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response error.');
      })
      .then((data) => {
        let firstAccount = '';
        if (data.length > 0) {
          firstAccount = data[0].id;
        }
        this.setState({ accounts: data, accountId: firstAccount });
      })
      .catch(() => {
        const { history } = this.props;
        history.push('/');
      }); // If an error is thrown, go back to homepage
  }

  loadCategories() {
    const url = '/api/categories';
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response error.');
      })
      .then((data) => {
        const categories = [];
        const subcategories = [];
        data.forEach((category) => {
          if (category.parent_id == null) {
            categories.push(category);
          } else {
            subcategories.push(category);
          }
        });
        let firstCategory = '';
        if (categories.length > 0) {
          firstCategory = categories[0].id;
        }
        this.setState({ categories, subcategories, categoryId: firstCategory });
      })
      .catch(() => {
        const { history } = this.props;
        history.push('/');
      }); // If an error is thrown, go back to homepage
  }

  addTransactionButton() {
    this.setState({
      adding: true, deleting: false, updating: false, transactionDate: '', payee: '', description: '', amountOut: '', messages: [],
    });
  }

  deleteTransactionButton() {
    this.setState({
      deleting: true, adding: false, updating: false, messages: [],
    });
  }

  addCancel() {
    this.setState({
      adding: false, transactionDate: '', payee: '', description: '', amountOut: '', messages: [],
    });
  }

  addSave(event) {
    event.preventDefault();
    const url = '/api/transactions';
    const method = 'POST';
    this.sendData(url, method);
  }

  updateCancel() {
    this.setState({ updating: false });
  }

  updateSave() {
    const { transactionId } = this.state;
    const url = `/api/transactions/${transactionId}`;
    const method = 'PATCH';
    this.sendData(url, method);
  }

  deleteCancel() {
    this.setState({ deleting: false, selectedRows: [] });
  }

  deleteSave() {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      const { messages } = this.state;
      messages.push('No selected rows.');
      this.setState({ messages });
    } else {
      this.setState({ messages: [] });
      const url = '/api/transactions';
      const body = { selected_rows: selectedRows };
      const token = document.querySelector("meta[name='csrf-token']").content;

      fetch(url, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw response;
        })
        .then(() => {
          this.loadTransactions();
          this.setState({ selectedRows: [] });
          document.querySelectorAll('input[type=checkbox]').prop('checked', false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  sendData(url, method) {
    const {
      transactionDate, accountId, payee, subcategoryId, description, amountOut, messages,
    } = this.state;
    const body = {
      transaction_date: transactionDate,
      account_id: accountId,
      payee,
      category_id: subcategoryId,
      description,
      amount_out: amountOut,
    };
    const token = document.querySelector("meta[name='csrf-token']").content;

    fetch(url, {
      method,
      headers: {
        'X-CSRF-TOKEN': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(() => {
        this.loadTransactions();
        this.setState({
          transactionDate: '', accountId: '', payee: '', categoryId: '', description: '', amountOut: '', messages: [], updating: false,
        });
      })
      .catch((error) => {
        error.json().then((response) => {
          const keys = Object.keys(response.data);
          if (keys.includes('transaction_date')) {
            messages.push(`Date ${response.data.transaction_date}`);
          }
          if (keys.includes('payee')) {
            messages.push(`Payee ${response.data.payee}`);
          }
          if (keys.includes('amount_out')) {
            messages.push(`Amount out ${response.data.amount_out}`);
          }
          this.setState({ messages });
        });
      });
  }

  update(transaction) {
    this.setState({
      updating: true,
      deleting: false,
      adding: false,
      messages: [],
      transactionId: transaction.id,
      transactionDate: transaction.transaction_date,
      accountId: transaction.account_id,
      payee: transaction.payee,
      categoryId: transaction.category_id,
      subcategoryId: transaction.subcategory_id,
      description: transaction.description,
      amountOut: transaction.amount_out,
    });
  }

  render() {
    const {
      transactions, isLoaded, adding, deleting, updating, messages, transactionId,
      transactionDate, accounts, accountId, payee, categories, categoryId, subcategories,
      subcategoryId, description, amountOut,
    } = this.state; // Same as const transactions = this.state.transactions (destructuring)
    const selectTransactionCategoryOptions = (
      <select name="categoryId" onChange={this.onChange} className="category-select custom-select-sm" value={categoryId}>
        {categories.map((category) => (
          <option value={category.id} key={category.id}>{category.name}</option>
        ))}
      </select>
    );
    const selectTransactionSubcategoryOptions = (
      <select name="subcategoryId" onChange={this.onChange} className="category-select custom-select-sm" value={subcategoryId}>
        {subcategories.map((subcategory) => (
          (subcategory.parent_id === categoryId)
            ? <option value={subcategory.id} key={subcategory.id}>{subcategory.name}</option> : null
        ))}
      </select>
    );
    const selectTransactionAccountOptions = (
      <select name="accountId" onChange={this.onChange} className="account-select custom-select-sm" value={accountId}>
        {accounts.map((account) => (
          <option value={account.id} key={account.id}>{account.name}</option>
        ))}
      </select>
    );
    const transactionsRows = transactions.map((transaction) => (
      <tr key={transaction.id}>
        {deleting
          && (
            <td>
              <input type="checkbox" value={transaction.id} onChange={this.onCheckboxChange} />
            </td>
          )}
        {(updating && transactionId === transaction.id)
          ? (
            <td className="date-cell">
              <input type="date" name="transactionDate" onChange={this.onChange} value={transactionDate} className="date-input" />
            </td>
          )
          : <td onClick={() => this.update(transaction)} className="date-cell">{transaction.transaction_date}</td>}
        {/* transaction_date alone cannot be used since it's not stored */}
        {/* yet in the state (will be stored once we click) */}
        {(updating && transactionId === transaction.id)
          ? (
            <td className="account-cell">
              {selectTransactionAccountOptions}
            </td>
          )
          : <td onClick={() => this.update(transaction)} className="account-cell">{transaction.account_name}</td>}
        {(updating && transactionId === transaction.id)
          ? (
            <td className="payee-cell">
              <input type="text" name="payee" onChange={this.onChange} value={payee} className="payee-input" />
            </td>
          )
          : <td onClick={() => this.update(transaction)} className="payee-cell">{transaction.payee}</td>}
        {(updating && transactionId === transaction.id)
          ? (
            <td className="category-cell">
              {selectTransactionCategoryOptions}
            </td>
          )
          : <td onClick={() => this.update(transaction)} className="category-cell">{transaction.category_name}</td>}
        {/* category_name is used to match rails name for this variable */}
        {(updating && transactionId === transaction.id)
          ? (
            <td className="category-cell">
              {selectTransactionSubcategoryOptions}
            </td>
          )
          : <td onClick={() => this.update(transaction)} className="category-cell">{transaction.subcategory_name}</td>}
        {(updating && transactionId === transaction.id)
          ? (
            <td className="description-cell">
              <input type="text" name="description" onChange={this.onChange} value={description} className="description-input" />
            </td>
          )
          : <td onClick={() => this.update(transaction)} className="description-cell">{transaction.description}</td>}
        {(updating && transactionId === transaction.id)
          ? (
            <td className="amount_out-cell">
              <input type="text" name="amountOut" onChange={this.onChange} value={amountOut} className="amount_out-input" />
            </td>
          )
          : <td onClick={() => this.update(transaction)} className="amount_out-cell">{transaction.amount_out}</td>}
      </tr>
    ));
    const addTransactionRow = (
      <tr>
        <td className="date-cell">
          <input type="date" name="transactionDate" onChange={this.onChange} value={transactionDate} className="date-input" />
        </td>
        <td className="account-cell">
          {selectTransactionAccountOptions}
        </td>
        <td className="payee-cell">
          <input type="text" name="payee" onChange={this.onChange} value={payee} className="payee-input" />
        </td>
        <td className="category-cell">
          {selectTransactionCategoryOptions}
        </td>
        <td className="category-cell">
          {selectTransactionSubcategoryOptions}
        </td>
        <td className="description-cell">
          <input type="text" name="description" onChange={this.onChange} value={description} className="description-input" />
        </td>
        <td className="amount_out-cell">
          <input type="text" name="amountOut" onChange={this.onChange} value={amountOut} className="amount_out-input" />
        </td>
      </tr>
    );
    const addButtonsAndErrors = (
      <div className="mt-2">
        <button type="button" className="btn btn-primary btn-sm mr-1" onClick={this.addSave}>Add</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={this.addCancel}>Cancel</button>
        <span className="text-danger">{messages.join('. ')}</span>
      </div>
    );
    const deleteButtonsAndError = (
      <div className="mt-2">
        <button type="button" className="btn btn-primary btn-sm mr-1" onClick={this.deleteSave}>Delete</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={this.deleteCancel}>Cancel</button>
        <span className="text-danger">{messages.join('. ')}</span>
      </div>
    );
    const updateButtonsAndError = (
      <div className="mt-2">
        <button type="button" className="btn btn-primary btn-sm mr-1" onClick={this.updateSave}>Update</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={this.updateCancel}>Cancel</button>
        <span className="text-danger">{messages.join('. ')}</span>
      </div>
    );
    const transactionsTable = (
      <div>
        <table>
          <thead>
            <tr>
              {deleting
              && <th> </th>}
              <th className="date-cell">Date</th>
              <th className="account-cell">Account</th>
              <th className="payee-cell">Payee</th>
              <th className="category-cell">Category</th>
              <th className="category-cell">Subcategory</th>
              <th className="description-cell">Description</th>
              <th className="amount_out-cell">Amount Out</th>
            </tr>
          </thead>
          <tbody>
            {transactionsRows}
            {adding && addTransactionRow}
          </tbody>
        </table>
        {adding && addButtonsAndErrors}
        {deleting && deleteButtonsAndError}
        {updating && updateButtonsAndError}
      </div>
    );
    const noTransaction = (
      <p>No transactions to show.</p>
    );
    const loadingTransactions = (
      <p>Transactions are loading.</p>
    );

    return (
      <div className="container">
        <h1 id="top">Transactions</h1>
        <button type="button" className="btn btn-primary mb-3 mr-2" onClick={this.addTransactionButton}>
          Add Transaction
        </button>
        <button type="button" className="btn btn-outline-danger mb-3 mr-2" onClick={this.deleteTransactionButton}>
          Delete Transactions
        </button>
        <Link to="/" className="btn btn-outline-primary mb-3">Back to Home</Link>
        {isLoaded
          ? (
            <div>
              {(transactions.length > 0) ? transactionsTable : noTransaction}
            </div>
          )
          : loadingTransactions}
        <Link to="#top">Scroll to top</Link>
      </div>
    );
  }
}

export default Transactions;
