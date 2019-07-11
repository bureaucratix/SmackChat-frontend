import React from 'react';
import Login from '../containers/Login';
import SignUp from '../components/SignUp';
import ChannelsContainer from './ChannelsContainer'
import Header from '../components/Header'
import {BrowserRouter as Router, Route} from 'react-router-dom'

class Primary extends React.Component {

    getToken() {
        return localStorage.getItem('jwt')
    } 

    render() {
        
        return (
            <Router>
            <div className="App">
                <main>
                    <Header />
                    <Route exact path='/' component={ChannelsContainer} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/signup' component={SignUp} />
                    
                    
                    
                </main>
            </div>
            </Router>
    
        );
    }
}

export default Primary;