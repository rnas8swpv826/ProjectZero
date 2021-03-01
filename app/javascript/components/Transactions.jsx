import React from "react";
import * as styles from "./styles.css";

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      isLoaded: false,
      addingTransaction: false
    };
    this.loadTransactions = this.loadTransactions.bind(this);
    this.addTransactionClick = this.addTransactionClick.bind(this);
    this.cancelClick = this.cancelClick.bind(this);
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
    this.setState({addingTransaction: false});
  }

  render() {
    const {transactions, isLoaded, addingTransaction} = this.state; // Same as const transactions = this.state.transactions (destructuring)
    const transactionsRows = transactions.map((transaction, index) => (
      <tr key={index}>
        <td>{transaction.payee}</td>
        <td>{transaction.description}</td>
        <td>{transaction.amount_out}</td>
      </tr>
    ));
    const addTransactionRow = (
      <tr>
        <td><input type="text" /></td>
        <td><input type="text" /></td>
        <td><input type="text" /></td>
        <td>
          <button className="btn btn-primary btn-sm mr-1">Save</button>
          <button className="btn btn-secondary btn-sm" onClick={this.cancelClick}>Cancel</button>
        </td>
      </tr>
    );
    const transactionsTable = (
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
