import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Home from "../components/Home";
import Transactions from "../components/Transactions";
import AddCategory from "../components/AddCategory";
import AddAccount from "../components/AddAccount";

export default (
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/transactions" exact component={Transactions} />
      <Route path="/categories/new" exact component={AddCategory} />
      <Route path="/accounts/new" exact component={AddAccount} />
    </Switch>
  </Router> 
);
