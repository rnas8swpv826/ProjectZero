import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Home from "../components/Home";
import Transactions from "../components/Transactions";
import AddTransaction from "../components/AddTransaction";

export default (
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/transactions" exact component={Transactions} />
      <Route path="/transaction" exact component={AddTransaction} />
    </Switch>
  </Router> 
);
