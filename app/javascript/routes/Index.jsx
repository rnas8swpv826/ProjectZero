import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../components/Home';
import Transactions from '../components/Transactions/Transactions';
import Accounts from '../components/Accounts/Accounts';
// import Categories from '../components/Categories';

export default (
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/transactions" exact component={Transactions} />
      <Route path="/accounts" exact component={Accounts} />
      {/* <Route path="/categories" exact component={Categories} /> */}
    </Switch>
  </Router>
);
