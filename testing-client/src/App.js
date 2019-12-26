import React from 'react';
import { Route, Link, NavLink } from 'react-router-dom';
import './App.css';
import FileUpload from './Components/FileUpload';
import Login from './Components/Login';
import Register from './Components/Register';

function App() {
  return (
    <div className="App">
      <header style={{border: '1px solid black', height: '75px'}}>
        <nav style={{display: 'flex', justifyContent: 'space-evenly', width: '400px', border: '1px solid red'}}>
          <NavLink className='navLink' to='/Register'>Sign up</NavLink>
          <NavLink className='navLink' to='/Login'>Sign in</NavLink>
          <NavLink className='navLink' to='/Upload'>Upload Files</NavLink>
        </nav>
      </header>
      
        <Route exact path='/Register' render={props => <Register {...props} />} />
        <Route exact path='/Login' render={props => <Login {...props} />} />
        <Route exact path='/Upload' render={FileUpload} />
    </div>
  );
}

export default App;
