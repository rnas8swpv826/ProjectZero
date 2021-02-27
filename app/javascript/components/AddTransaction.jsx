import React from "react";

// Work in progress
class AddTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payee: "",
      description: "",
      amount_out: ""
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="container">
        <form onSubmit={this.onSubmit}>
          <input type="text" name="payee" />
          <input type="text" name="description" />
          <input type="text" name="amount_out" />
          <button type="submit">Add Transaction</button>
        </form>
      </div>
    );
  }

}
export default AddTransaction;
