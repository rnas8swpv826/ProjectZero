import React from "react";

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: []
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
      .then(response => this.setState({transactions: response}))
      .catch(() => this.props.history.push("/")); // If an error is thrown, go back to homepage
  }

  render() {
    const {transactions} = this.state; // Same as const transactions = this.state.transactions;
    const allTransactions = transactions.map((transaction, index) => (
      <div key={index}>
        <span>{transaction.description}</span>
      </div>
    ));
    const noTransaction = (
      <h3>No transactions to show.</h3>
    );
    return (
      <div className="container">
        <h1>Transactions</h1>
        {transactions.length > 0 ? allTransactions : noTransaction}
      </div>
    );
  }
} 

export default Transactions;
