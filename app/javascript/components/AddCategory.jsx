import React from "react";
import {Link} from "react-router-dom";

class AddCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      error: "",
      categories: [],
      adding: true,
      renaming: false,
      deleting: false,
      categoryId: 0
    };
    this.loadCategories = this.loadCategories.bind(this);
    this.sendNew = this.sendNew.bind(this);
    this.sendRename = this.sendRename.bind(this);
    this.sendDelete = this.sendDelete.bind(this);
    this.onChange = this.onChange.bind(this);
    this.rename = this.rename.bind(this);
  }

  loadCategories() {
    const url = "/api/categories";
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        else {
          throw new Error("Network response error.");
        }
      })
      .then((data) => {
        this.setState({categories: data});
      })
      .catch(() => this.props.history.push("/")); // If an error is thrown, go back to homepage
  }

  componentDidMount() {
    this.loadCategories();
  }

  sendNew() {
    const url = "/api/categories";
    const method = "POST";
    this.sendData(url, method);
  }

  sendRename() {
    const {categoryId} = this.state;
    const url = `/api/categories/${categoryId}`;
    const method = "PATCH";
    this.sendData(url, method);
  }

  sendData(url, method) {
    const {name, categoryId} = this.state;
    const body = {name, id: categoryId};
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
        this.loadCategories();
        this.setState({name: "", categoryId: 0, adding: true, renaming: false});
      })
      .catch((error) => {
        error.json().then((body) => {
          const keys = Object.keys(body.data);
          if (keys.includes("name")) {
            this.setState({ error: `Name ${body.data.name}` });
          }
        });
      });
  }

  sendDelete(category) {
    const {name} = this.state;
    const url = `/api/categories/${category.id}`;
    const body = {name, id: category.id};
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
        this.loadCategories();
        this.setState({name: "", categoryId: 0});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  rename(category) {
    this.setState({name: category.name, categoryId: category.id, renaming: true, adding: false})
  }

  render() {
    const {adding, renaming, categories, name} = this.state;
    return (
      <div className="container mt-5">
        <div className="col-lg-6 offset-lg-3">
          <h1 className="mb-3">Add a new category</h1>
          <h6>Name</h6>
          <input className="form-control" type="text" name="name" onChange={this.onChange} value={name} />
          <h6 className="text-danger">{this.state.error}</h6>
          {adding &&
            <button className="btn btn-primary" onClick={this.sendNew}>Add Category</button>}
          {renaming &&
            <button className="btn btn-primary" onClick={this.sendRename}>Rename</button>}
          <Link to="/" className="btn btn-link">Back to Home</Link>
          <Link to="/transactions" className="btn btn-link">Back to Transactions</Link>
    
          <h1 className="mb-3 mt-3">Existing categories</h1>
          {categories.map((category, index) => (
            <div key={index}>
              <span>{category.name}</span>
              <button className="btn btn-link" onClick={() => this.rename(category)}>Rename</button>
              <button className="btn btn-link" onClick={() => this.sendDelete(category)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default AddCategory;
