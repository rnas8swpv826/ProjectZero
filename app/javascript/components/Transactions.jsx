import React from "react";
import {Link} from 'react-router-dom';
import * as styles from "./styles.css";

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      isLoaded: false
    };
  }

  componentDidMount() {
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
      .then(data => this.setState({transactions: data, isLoaded: true}))
      .catch(() => this.props.history.push("/")); // If an error is thrown, go back to homepage
  }

  render() {
    const {transactions, isLoaded} = this.state; // Same as const transactions = this.state.transactions;
    const transactionsRows = transactions.map((transaction, index) => (
      <tr key={index}>
        <td>{transaction.payee}</td>
        <td>{transaction.description}</td>
        <td>{transaction.amount_out}</td>
      </tr>
    ));
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
        <Link to="/transactions/new" className="btn btn-primary mb-3">Add Transaction</Link>
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
