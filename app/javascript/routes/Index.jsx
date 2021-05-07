import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../components/Home';
import Transactions from '../components/Transactions';
import Categories from '../components/Categories';
import Accounts from '../components/Accounts';

export default (
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/transactions" exact component={Transactions} />
      <Route path="/categories" exact component={Categories} />
      <Route path="/accounts" exact component={Accounts} />
    </Switch>
  </Router>
);
