import React from "react";
import {Link} from "react-router-dom";
import * as styles from "./styles.css";
import $ from "jquery";

class AddCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      error: "",
      categories: [],
      adding: true,
      renaming: false,
      showModal: false,
      categoryId: 0
    };
    this.loadCategories = this.loadCategories.bind(this);
    this.sendNew = this.sendNew.bind(this);
    this.sendRename = this.sendRename.bind(this);
    this.sendDelete = this.sendDelete.bind(this);
    this.onChange = this.onChange.bind(this);
    this.rename = this.rename.bind(this);
    this.cancelRename = this.cancelRename.bind(this);
    this.toDelete = this.toDelete.bind(this);
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

  sendDelete() {
    const {name, categoryId} = this.state;
    const url = `/api/categories/${categoryId}`;
    const body = {name, id: categoryId};
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
        $("#deleteConfirmation").modal('hide');
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

  toDelete(category) {
    this.setState({name: category.name, categoryId: category.id})
  }

  cancelRename() {
    this.setState({name: "", renaming: false, adding: true})
  }

  render() {
    const {adding, renaming, categories, name} = this.state;
    const deleteConfirmation = (
      <div className="modal fade" id="deleteConfirmation" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirmation required</h5>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete {name}?</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button className="btn btn-primary" onClick={this.sendDelete}>Yes</button>
            </div>
          </div>
        </div>
      </div>
    );
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
          {renaming &&
            <button className="btn btn-secondary" onClick={this.cancelRename}>Cancel</button>}

          <h1 className="mb-3 mt-3">Existing categories</h1>
          {categories.map((category, index) => (
            <div key={index} className="container">
              <div className="row">
                <div className="col-sm-3">
                  <span>{category.name}</span>
                </div>
                <div className="col-sm-3">
                  <button className="btn btn-link rename-delete-btn" onClick={() => this.rename(category)}>Rename</button>
                </div>
                <div className="col-sm-3">
                  <button className="btn btn-link rename-delete-btn" data-toggle="modal" data-target="#deleteConfirmation" onClick={() => this.toDelete(category)}>Delete</button>
                  {deleteConfirmation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default AddCategory;
