import React from 'react';
import {Link} from 'react-router-dom';

export default () => (
  <div>
    <h1>Hello World from react</h1>
    <Link to='/transactions'>See Transactions</Link>
  </div>
);
