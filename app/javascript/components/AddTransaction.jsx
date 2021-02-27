import React from "react";

class AddTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payee: "",
      description: "",
      amount_out: ""
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
  }

  onChange(event) {
    this.setState({[event.target.name]: event.target.value});
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
            </div>

            <div className="form-group">
              <label htmlFor="description_input">Description</label>
              <input type="text" name="description" id="description_input" className="form-control" onChange={this.onChange} />
            </div>

            <div className="form-group">
              <label htmlFor="amount_out_input">Amount Out</label>
              <input type="text" name="amount_out" id="amount_out_input" className="form-control" onChange={this.onChange} />
            </div>

            <button type="submit" className="btn btn-primary">Add Transaction</button>
          </form>
        </div>
      </div>
    );
  }
}

export default AddTransaction;
