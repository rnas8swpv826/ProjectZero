import React from "react";
import { Link } from "react-router-dom";

class AddTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payee: "",
      description: "",
      amount_out: "",
      payee_error: "",
      amount_out_error: ""
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();

    const url = "/api/transactions";
    const { payee, description, amount_out } = this.state;
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
      .then(() => this.props.history.push("/transactions"))
      .catch((error) => {
        error.json().then((body) => {
          const keys = Object.keys(body.data);
          if (keys.includes("payee")) {
            this.setState({ payee_error: `Payee ${body.data.payee}` });
          }
          if (keys.includes("amount_out")) {
            this.setState({ amount_out_error: `Amount out ${body.data.amount_out}` });
          }
        });
      });
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      // mt-5 = margin top
      <div className="container mt-5">
        <div className="col-lg-6 offset-lg-3">
          <h1 className="mb-3">Add a new transaction</h1>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label htmlFor="payee_input">Payee</label>
              <input type="text" name="payee" id="payee_input" className="form-control" onChange={this.onChange} />
              <span className="text-danger">{this.state.payee_error}</span>
            </div>

            <div className="form-group">
              <label htmlFor="description_input">Description</label>
              <input type="text" name="description" id="description_input" className="form-control" onChange={this.onChange} />
            </div>

            <div className="form-group">
              <label htmlFor="amount_out_input">Amount Out</label>
              <input type="text" name="amount_out" id="amount_out_input" className="form-control" onChange={this.onChange} />
              <span className="text-danger">{this.state.amount_out_error}</span>
            </div>

            <button type="submit" className="btn btn-primary">Add Transaction</button>
            <Link to="/transactions" className="btn btn-link">Back to Transactions</Link>
          </form>
        </div>
      </div>
    );
  }
}

export default AddTransaction;
