import React from 'react';
import {Link} from 'react-router-dom';

export default () => (
  <div className='container'>
    <h1>Hello World from react</h1>
    <Link to='/transactions' className='btn btn-primary'>See Transactions</Link>
  </div>
);
