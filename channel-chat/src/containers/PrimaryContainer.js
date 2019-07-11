import React from 'react';
import { API_ROOT } from '../constants/index';

import Login from '../containers/Login';
import SignUp from '../components/SignUp';
import ChannelsContainer from './ChannelsContainer'
import Header from '../components/Header'
import {BrowserRouter as Router, Route} from 'react-router-dom'

class Primary extends React.Component {


    //-----Things that were in Login.js, maybe want them here to pass info to Header to display name and logout option-----
    state = {
        username: '',
        isLoggedIn: false
    }

    getToken() {
        return localStorage.getItem('jwt')
    } 
   
    getProfile = () => {
        let token = this.getToken()
        fetch(`${API_ROOT}/profile`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(json => {
                console.log('profile:', json)
                this.setState({ user: json.user, isLoggedIn:true })
            })
    }
    //-------------------------------

    render() {
        
        return (
            <Router>
            <div className="App">
                <main>
                    {/* Header not updating dynamically, possibly due to user being passed as props */}
                    <Header user={this.getToken()?this.getToken():null}/>
                    <Route exact path='/' component={this.getToken()?ChannelsContainer:Login} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/signup' component={SignUp} />
                    
                    
                    
                </main>
            </div>
            </Router>
    
        );
    }
}

export default Primary;