import React from 'react';
import Login from './containers/Login';
import './App.css';
import SignUp from './components/SignUp';
import ChannelsContainer from './containers/ChannelsContainer'

function App() {
  return (
    <div className="App">
      <main>
       <SignUp/>
      <Login />
      <ChannelsContainer/>
      </main>
    </div>
    
  );
}

export default App;
