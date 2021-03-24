import React from "react";
import {Link} from "react-router-dom";

class AddCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      error: ""
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();

    const url = "/api/categories";
    const {name} = this.state;
    const body = { name };
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
      .then(() => this.props.history.push("/"))
      .catch((error) => {
        error.json().then((body) => {
          const keys = Object.keys(body.data);
          if (keys.includes("name")) {
            this.setState({ error: `Name ${body.data.name}` });
          }
        });
      });
  }

  onChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  render() {
    return (
      // mt-5 = margin top
      <div className="container mt-5">
        <div className="col-lg-6 offset-lg-3">
          <h1 className="mb-3">Add a new category</h1>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label htmlFor="name_input">Name</label>
              <input type="text" name="name" id="name_input" className="form-control" onChange={this.onChange} />
              <span className="text-danger">{this.state.error}</span>
            </div>

            <button type="submit" className="btn btn-primary">Add Category</button>
            <Link to="/" className="btn btn-link">Back to Home</Link>
            <Link to="/transactions" className="btn btn-link">Back to Transactions</Link>
          </form>
        </div>
      </div>
    );
  }
}

export default AddCategory;
