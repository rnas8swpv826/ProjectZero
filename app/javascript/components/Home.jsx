import React from 'react';
import {Link} from 'react-router-dom';

export default () => (
  <div className='container'>
    <h1>Hello World from react</h1>
    <Link to='/transactions' className='btn btn-primary mr-2'>See Transactions</Link>
    <Link to='/accounts/new' className='btn btn-primary mr-2'>Add an Account</Link>
    <Link to='/categories/new' className='btn btn-primary'>Add a Category</Link>
  </div>
);
