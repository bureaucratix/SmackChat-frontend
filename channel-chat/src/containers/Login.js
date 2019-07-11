import React, { Component } from 'react';
import { API_ROOT } from '../constants/index';


export default class Login extends Component {
    state = {
        username: ''
    }

    constructor() {
        super()
        this.username = React.createRef()
        this.password = React.createRef()

        if (this.getToken()) {
            this.getProfile()
        }

        this.logout = this.logout.bind(this)
    }

    login = (ev) => {
        ev.preventDefault()
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
                } else {
                    alert(json.message)
                }
                window.location.reload()
            })
    }

    logout() {
        this.clearToken()
        this.setState({ username: '' })
        return false
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
                this.setState({ user: json.user })
            })
    }

  


    saveToken(jwt) {
        localStorage.setItem('jwt', jwt)
       
    }

    clearToken(jwt) {
        localStorage.setItem('jwt', '')
    }

    getToken(jwt) {
        return localStorage.getItem('jwt')
    }

    render() {
        return (
            <div className="App">
                <form onSubmit={this.login}>
                    <input type="text" placeholder="username" ref={this.username} />
                    <input type="password" placeholder="password" ref={this.password} />
                    <input type="submit" value="log in" />
                    <button type="button" onClick={this.logout}>log out</button>
                </form>
                <div>
                    user: {this.state.user && this.state.user.username || 'logged out'}
                </div>
                {this.state.user && <div>
                    <pre>
                        {'{\n'}
                        username: {this.state.user.username + '\n'}
                        name: {this.state.user.name + '\n'}
                        email: {this.state.user.email + '\n'}
                        {'}\n'}
                    </pre>
                    <pre>
         
                    </pre>
                </div>}
            </div>
        );
    }
}