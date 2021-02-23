import React from "react";

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
    const allTransactions = transactions.map((transaction, index) => (
      <div key={index}>
        <span>{transaction.description}</span>
      </div>
    ));
    const noTransaction = (
      <span>No transactions to show.</span>
    );
    const loadingTransactions = (
      <span>Transactions are loading.</span>
    );
    return (
      <div className="container">
        <h1>Transactions</h1>
        {isLoaded ?
          <div>
            {(transactions.length > 0) ? allTransactions : noTransaction}
          </div>
         : loadingTransactions}
      </div>
    );
  }
} 

export default Transactions;
