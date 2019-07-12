import React, { Component } from 'react';
import { API_ROOT } from '../constants/index';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";


export default class SignUp extends Component {

    state = {
        username: '',
        isLoggedIn: false
    }

    constructor() {
        super()
        this.username = React.createRef()
        this.password = React.createRef()
    }

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
        ).then(
            setTimeout(() => {
                this.login()
            }, 1000))
    }


    login = () => {
        console.log('log in')

        let username = this.username.current.value
        let password = this.password.current.value

        fetch(`${API_ROOT}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: { username, password } })
        })
            .then(res => res.json())
            .then(json => {
                console.log('login:', json)
                if (json && json.jwt) {
                    // let base64Url = json.jwt.split('.')[1];
                    // let base64 = base64Url.replace('-', '+').replace('_', '/');
                    // let userInfo =  JSON.parse(atob(base64));
                    // console.log(userInfo)
                    this.saveToken(json.jwt)
                    this.getProfile()
                    this.forceUpdate();
                } else {
                    alert(json.message)
                }
            })
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
                this.setState({ user: json.user, isLoggedIn: true })
            })
    }



    saveToken(jwt) {
        localStorage.setItem('jwt', jwt)

    }



    getToken(jwt) {
        return localStorage.getItem('jwt')
    }


    render() {
        if (this.state.isLoggedIn === true) {
            return <Redirect to="/" />
        }
        return (
            <div className="App ui two column centered grid">
                <form onSubmit={this.handleSubmit}>
                    <div className="ui form">
                        <div className="fields">
                            <div className="field">
                                <label>Username</label>
                                <input type="text" placeholder="username" id="username" ref={this.username}/>
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
                                <input type="password" placeholder="password" id="password" ref={this.password}/>
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