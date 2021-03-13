import React from "react";
import * as styles from "./styles.css";

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      isLoaded: false,
      addingTransaction: false,
      deletingTransactions: false,
      payee: "",
      description: "",
      amount_out: "",
      transaction_date: "",
      messages: [],
      selectedRows: [],
      updating: false,
      transactionId: 0
    };
    this.loadTransactions = this.loadTransactions.bind(this);
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
      .then(data => this.setState({ transactions: data, isLoaded: true }))
      .catch(() => this.props.history.push("/")); // If an error is thrown, go back to homepage
  }

  componentDidMount() {
    this.loadTransactions();
  }

  addTransactionClick() {
    this.setState({addingTransaction: true, deletingTransactions: false, updating: false});
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
    const { payee, description, amount_out, transaction_date, messages } = this.state;
    const body = { payee, description, amount_out, transaction_date };
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
        this.setState({ payee: "", description: "", amount_out: "", transaction_date: "", messages: [] });
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
      description: transaction.description,
      amount_out: transaction.amount_out,
      transaction_date: transaction.transaction_date,
      transactionId: transaction.id
    });
  }

  render() {
    const {transactions, isLoaded, addingTransaction, deletingTransactions, updating, messages, transactionId} = this.state; // Same as const transactions = this.state.transactions (destructuring)
    const transactionsRows = transactions.map((transaction, index) => (
      <tr key={index}>
        {deletingTransactions &&
          <td><input type="checkbox" value={transaction.id} onChange={this.onCheckboxChange}/></td>}
        {(updating && transactionId == transaction.id) ?
          <td><input type="date" name="transaction_date" onChange={this.onChange} value={this.state.transaction_date} /></td> :
          <td onClick={(event) => this.update(event, transaction)}>{transaction.transaction_date}</td>
        }
        {(updating && transactionId == transaction.id)?
          <td><input type="text" name="payee" onChange={this.onChange} value={this.state.payee}/></td> :
          <td onClick={(event) => this.update(event, transaction)}>{transaction.payee}</td>
        }
        {(updating && transactionId == transaction.id) ?
          <td><input type="text" name="description" onChange={this.onChange} value={this.state.description} /></td> :
          <td onClick={(event) => this.update(event, transaction)}>{transaction.description}</td>
        }
        {(updating && transactionId == transaction.id) ?
          <td><input type="text" name="amount_out" onChange={this.onChange} value={this.state.amount_out} /></td> :
          <td onClick={(event) => this.update(event, transaction)}>{transaction.amount_out}</td>
        }
      </tr>
    ));
    const addTransactionRow = (
      <tr>
        <td><input type="date" name="transaction_date" onChange={this.onChange} value={this.state.transaction_date} /></td>
        <td><input type="text" name="payee" onChange={this.onChange} value={this.state.payee}/></td>
        <td><input type="text" name="description" onChange={this.onChange} value={this.state.description}/></td>
        <td><input type="text" name="amount_out" onChange={this.onChange} value={this.state.amount_out}/></td>
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
              <th>Date</th>
              <th>Payee</th>
              <th>Description</th>
              <th>Amount Out</th>
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
