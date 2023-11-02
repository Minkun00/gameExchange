import React from 'react';
import KaikasConnect from './src/kaikasConnect/KaikasConnect';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ItemToImg from './src/itemToIMG/itemToImg';

function App() {
  return (
    <div>
      <h1>Welcome to MyToken DApp</h1>
      <KaikasConnect />
      <Router>
        <Route path="/inputCode" Component={ItemToImg}></Route>
      </Router>
    </div>
  );
};

export default App;
