import React from "react";
import * as styles from "./styles.css";

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      isLoaded: false,
      addingTransaction: false,
      payee: "",
      description: "",
      amount_out: "",
      messages: []
    };
    this.loadTransactions = this.loadTransactions.bind(this);
    this.addTransactionClick = this.addTransactionClick.bind(this);
    this.cancelClick = this.cancelClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
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
    this.setState({addingTransaction: true});
  }

  cancelClick() {
    this.setState({addingTransaction: false, payee: "", description: "", amount_out: "", messages: []});
  }

  onSubmit(event) {
    event.preventDefault();

    const url = "/api/transactions";
    const { payee, description, amount_out, messages } = this.state;
    const body = { payee, description, amount_out };
    const token = document.querySelector("meta[name='csrf-token']").content;

    fetch(url, {
      method: "POST",
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
        this.setState({payee: "", description: "", amount_out: "", messages: []});
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
          this.setState({messages: messages});
        });
      });
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const {transactions, isLoaded, addingTransaction, messages} = this.state; // Same as const transactions = this.state.transactions (destructuring)
    const transactionsRows = transactions.map((transaction, index) => (
      <tr key={index}>
        <td>{transaction.payee}</td>
        <td>{transaction.description}</td>
        <td>{transaction.amount_out}</td>
      </tr>
    ));
    const addTransactionRow = (
      <tr>
        <td><input type="text" name="payee" onChange={this.onChange} value={this.state.payee}/></td>
        <td><input type="text" name="description" onChange={this.onChange} value={this.state.description}/></td>
        <td><input type="text" name="amount_out" onChange={this.onChange} value={this.state.amount_out}/></td>
      </tr>
    );
    const addButtonsAndErrors = (
      <div className="mt-2">
        <button className="btn btn-primary btn-sm mr-1" onClick={this.onSubmit}>Save</button>
        <button className="btn btn-secondary btn-sm" onClick={this.cancelClick}>Cancel</button>
        <span className="text-danger">{messages.join(". ")}</span>
      </div>
    )
    const transactionsTable = (
      <div>
        <table>
          <thead>
            <tr>
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
        <button className="btn btn-primary mb-3" onClick={this.addTransactionClick}>Add Transaction</button>   
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
