import React from 'react';
import Login from './containers/Login';
import './App.css';
import SignUp from './components/SignUp';

function App() {
  return (
    <div className="App">
      <SignUp/>
      <Login />
    </div>
  );
}

export default App;
