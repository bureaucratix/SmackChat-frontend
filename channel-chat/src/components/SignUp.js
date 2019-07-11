import React, { Component } from 'react';
import { API_ROOT } from '../constants/index';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


export default class SignUp extends Component {


    // constructor() {
    //     super()
    //     this.state = {
    //         username: '',
    //         name: '', 
    //         password: '', 
    //         email: ''
    //     }
    // }

    handleSubmit = (event) => {
        event.preventDefault();
        let username = event.target[0].value
        let name = event.target[1].value
        let email = event.target[2].value
        let password = event.target[3].value
        fetch(`${API_ROOT}/users`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'
        },
            body: JSON.stringify({
                username: username,
                name: name,
                password: password,
                email: email
            })

        }
        )
    }


    render() {
        return (
            <div className="App ui two column centered grid">
                <form onSubmit={this.handleSubmit}>
                    <div className="ui form">
                        <div className="fields">
                            <div className="field">
                                <label>Username</label>
                                <input type="text" placeholder="username" id="username"/>
                            </div>
                            <div className="field">
                                <label>Name</label>
                                <input type="text" placeholder="name" id="name"/>
                            </div>
                        </div>
                    </div>
                    <div className="ui form">
                        <div className="fields">
                            <div className="field">
                                <label>Email</label>
                                <input type="text" placeholder="email" id="email"/>
                            </div>
                            <div className="field">
                                <label>Password</label>
                                <input type="password" placeholder="password" id="password"/>
                            </div>
                        </div>
                    </div>
                    {/* <input  type="text" placeholder="username" id="username" />
                    <input type="text" placeholder="name"  id='name'/>
                    <input type="text" placeholder="email" id ="email"/>
                    <input type="password" placeholder="password"  id="password"/> */}
                    <input className="ui secondary button" type="submit" value="Sign Up" />
                </form>
                <div><Link to="/login"> I already have an account!</Link></div>
            </div>
        );
    }
}