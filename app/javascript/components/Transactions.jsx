import React from "react";
import * as styles from "./styles.css";

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      categories: [],
      isLoaded: false,
      addingTransaction: false,
      deletingTransactions: false,
      transaction_date: "",
      payee: "",
      categoryId: "",
      description: "",
      amount_out: "",
      messages: [],
      selectedRows: [],
      updating: false,
      transactionId: 0
    };
    this.loadTransactions = this.loadTransactions.bind(this);
    this.loadCategories = this.loadCategories.bind(this);
    this.addTransactionClick = this.addTransactionClick.bind(this);
    this.deleteTransactionClick = this.deleteTransactionClick.bind(this);
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

  loadTransactions() {
    const url = "/api/transactions";
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        else {
          throw new Error("Network response error.");
        }
      })
      .then((data) => {
        this.setState({ transactions: data, isLoaded: true });
      })
      .catch(() => this.props.history.push("/")); // If an error is thrown, go back to homepage
  }

  loadCategories() {
    const url = "/api/categories";
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        else {
          throw new Error("Network response error.");
        }
      })
      .then((data) => {
        let firstCategory = "";
        if (data.length > 0) {
          firstCategory = data[0].id;
        }
        this.setState({categories: data, categoryId: firstCategory});
      })
      .catch(() => this.props.history.push("/")); // If an error is thrown, go back to homepage
  }

  componentDidMount() { // Will load data before render runs
    this.loadTransactions();
    this.loadCategories();
  }

  addTransactionClick() {
    this.setState({ addingTransaction: true, deletingTransactions: false, updating: false, transaction_date: "", payee: "", category:"", description: "", amount_out: ""});
  }

  deleteTransactionClick() {
    this.setState({deletingTransactions: true, addingTransaction: false, updating: false, messages: []});
  }

  addCancel() {
    this.setState({addingTransaction: false, payee: "", description: "", amount_out: "", transaction_date: "", messages: []});
  }

  addSave(event) {
    event.preventDefault();
    const url = "/api/transactions";
    const method = "POST";
    this.sendData(url, method);
  }

  sendData(url, method) {
    const {transaction_date, payee, categoryId, description, amount_out, messages} = this.state;
    const body = {transaction_date, payee, category_id: categoryId, description, amount_out};
    const token = document.querySelector("meta[name='csrf-token']").content;

    fetch(url, {
      method: method,
      headers: {
        "X-CSRF-TOKEN": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        else {
          throw response;
        }
      })
      .then(() => {
        this.loadTransactions();
        this.setState({ transaction_date: "", payee: "", categoryId: "", description: "", amount_out: "", messages: [], updating: false });
      })
      .catch((error) => {
        error.json().then((body) => {
          const keys = Object.keys(body.data);
          if (keys.includes("payee")) {
            messages.push(`Payee ${body.data.payee}`);
          }
          if (keys.includes("amount_out")) {
            messages.push(`Amount out ${body.data.amount_out}`);
          }
          if (keys.includes("transaction_date")) {
            messages.push(`Date ${body.data.transaction_date}`);
          }
          this.setState({ messages: messages });
        });
      });
  }

  updateSave() {
    const transactionId = this.state.transactionId;
    const url = `/api/transactions/${transactionId}`;
    const method = "PATCH";
    this.sendData(url, method);
  }

  deleteCancel() {
    this.setState({deletingTransactions: false, selectedRows: []});
  }

  deleteSave() {
    if (this.state.selectedRows.length == 0) {
      const messages = this.state.messages;
      messages.push("No selected rows.");
      this.setState({messages: messages});
    }
    else {
      this.setState({messages: []});
      const url = "/api/transactions";
      const {selectedRows} = this.state;
      const body = {selected_rows: selectedRows};
      const token = document.querySelector("meta[name='csrf-token']").content;
      
      fetch(url, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          else {
            throw response;
          }
        })
        .then(() => {
          this.loadTransactions();
          this.setState({selectedRows: []});
          document.querySelectorAll("input[type=checkbox]").forEach(checkbox => checkbox.checked = false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  updateCancel() {
    this.setState({updating: false});
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onCheckboxChange(event) {
    const selectedRows = this.state.selectedRows;
    const checked = event.target.checked;
    if (checked) {
      selectedRows.push(event.target.value);
    }
    else {
      const uncheckedIndex = selectedRows.indexOf(event.target.value);
      selectedRows.splice(uncheckedIndex, 1);
    }
    this.setState({selectedRows: selectedRows});
  }

  update(event, transaction) {
    this.setState({
      updating: true,
      deletingTransactions: false,
      addingTransaction: false,
      payee: transaction.payee,
      categoryId: transaction.category_id,
      description: transaction.description,
      amount_out: transaction.amount_out,
      transaction_date: transaction.transaction_date,
      transactionId: transaction.id
    });
  }

  render() {
    const {transactions, categories, isLoaded, addingTransaction, deletingTransactions, updating, messages, transactionId, 
      transaction_date, payee, categoryId, description, amount_out} = this.state; // Same as const transactions = this.state.transactions (destructuring)
    const selectTransactionCategoryOptions = (
      <select name="categoryId" onChange={this.onChange} className="category-select custom-select" value={categoryId}>
        {categories.map((category, index) => (
        <option value={category.id} key={index}>{category.name}</option>
        ))}
      </select>
    );
    const transactionsRows = transactions.map((transaction, index) => (
      <tr key={index}>
        {deletingTransactions &&
          <td>
            <input type="checkbox" value={transaction.id} onChange={this.onCheckboxChange}/>
          </td>}
        {(updating && transactionId == transaction.id) ?
          <td className="date-cell">
            <input type="date" name="transaction_date" onChange={this.onChange} value={transaction_date} className="date-input"/>
          </td>
           : <td onClick={(event) => this.update(event, transaction)} className="date-cell">{transaction.transaction_date}</td>
        }
        {(updating && transactionId == transaction.id)?
          <td className="payee-cell">
            <input type="text" name="payee" onChange={this.onChange} value={payee} className="payee-input"/>
          </td>
           : <td onClick={(event) => this.update(event, transaction)} className="payee-cell">{transaction.payee}</td>
        } 
        {(updating && transactionId == transaction.id) ?
          <td className="category-cell">
            {selectTransactionCategoryOptions}
          </td>
           : <td onClick={(event) => this.update(event, transaction)} className="category-cell">{transaction.category_name}</td> // category_name is used to match rails name for this variable
        }
        {(updating && transactionId == transaction.id) ?
          <td className="description-cell">
            <input type="text" name="description" onChange={this.onChange} value={description} className="description-input" />
          </td>
           : <td onClick={(event) => this.update(event, transaction)} className="description-cell">{transaction.description}</td>
        }
        {(updating && transactionId == transaction.id) ?
          <td className="amount_out-cell">
            <input type="text" name="amount_out" onChange={this.onChange} value={amount_out} className="amount_out-input" />
          </td>
           : <td onClick={(event) => this.update(event, transaction)} className="amount_out-cell">{transaction.amount_out}</td>
        }
      </tr>
    ));
    const addTransactionRow = (
      <tr>
        <td className="date-cell">
          <input type="date" name="transaction_date" onChange={this.onChange} value={this.state.transaction_date} className="date-input"/>
        </td>
        <td className="payee-cell">
          <input type="text" name="payee" onChange={this.onChange} value={this.state.payee} className="payee-input"/>
        </td>
        <td className="category-cell">
          {selectTransactionCategoryOptions}
        </td>
        <td className="description-cell">
          <input type="text" name="description" onChange={this.onChange} value={this.state.description} className="description-input"/>
        </td>
        <td className="amount_out-cell">
          <input type="text" name="amount_out" onChange={this.onChange} value={this.state.amount_out} className="amount_out-input"/>
        </td>
      </tr>
    );
    const addButtonsAndErrors = (
      <div className="mt-2">
        <button className="btn btn-primary btn-sm mr-1" onClick={this.addSave}>Add</button>
        <button className="btn btn-secondary btn-sm" onClick={this.addCancel}>Cancel</button>
        <span className="text-danger">{messages.join(". ")}</span>
      </div>
    );
    const deleteButtonsAndError =(
      <div className="mt-2">
        <button className="btn btn-primary btn-sm mr-1" onClick={this.deleteSave}>Delete</button>
        <button className="btn btn-secondary btn-sm" onClick={this.deleteCancel}>Cancel</button>
        <span className="text-danger">{messages.join(". ")}</span>
      </div>
    );
    const updateButtonsAndError = (
      <div className="mt-2">
        <button className="btn btn-primary btn-sm mr-1" onClick={this.updateSave}>Update</button>
        <button className="btn btn-secondary btn-sm" onClick={this.updateCancel}>Cancel</button>
        <span className="text-danger">{messages.join(". ")}</span>
      </div>
    );
    const transactionsTable = (
      <div>
        <table>
          <thead>
            <tr>
              {deletingTransactions &&
                <th></th>}
              <th className="date-cell">Date</th>
              <th className="payee-cell">Payee</th>
              <th className="category-cell">Category</th>
              <th className="description-cell">Description</th>
              <th className="amount_out-cell">Amount Out</th>
            </tr>
          </thead>
          <tbody>
            {transactionsRows}
            {addingTransaction &&
              addTransactionRow
            }
          </tbody>
        </table>
        {addingTransaction &&
          addButtonsAndErrors}
        {deletingTransactions &&
          deleteButtonsAndError}
        {updating &&
          updateButtonsAndError}
      </div>
    )
    const noTransaction = (
      <p>No transactions to show.</p>
    );
    const loadingTransactions = (
      <p>Transactions are loading.</p>
    );
    
    return (
      <div className="container">
        <h1>Transactions</h1>
        <button className="btn btn-primary mb-3 mr-2" onClick={this.addTransactionClick}>Add Transaction</button>
        <button className="btn btn-outline-danger mb-3" onClick={this.deleteTransactionClick}>Delete Transactions</button>   
        {isLoaded ?
          <div>
            {(transactions.length > 0) ? transactionsTable : noTransaction}
          </div>
         : loadingTransactions}
      </div>
    );
  }
} 

export default Transactions;
