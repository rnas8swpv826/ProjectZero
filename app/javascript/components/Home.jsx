import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <h1>Transactions Tracker</h1>
      <Link to="/transactions" className="btn btn-primary mr-2">See Transactions</Link>
      {/* <Link to="/accounts" className="btn btn-primary mr-2">See Accounts</Link>
      <Link to="/categories" className="btn btn-primary">See Categories</Link> */}
    </div>
  );
}

export default Home;
