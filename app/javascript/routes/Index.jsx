import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from '../components/Home';
import Transactions from '../components/Transactions';

export default (
  <Router>
    <Switch>
      <Route path='/' exact component={Home} />
      <Route path='/transactions' exact component={Transactions} />
    </Switch>
  </Router> 
);
