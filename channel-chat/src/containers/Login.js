import React, { Component } from 'react';


export default class Login extends Component {
    state = {
        username: '',
        channels: []
    }

    constructor() {
        super()
        this.username = React.createRef()
        this.password = React.createRef()

        if (this.getToken()) {
            this.getProfile()
            this.getChannels()
        }

        this.logout = this.logout.bind(this)
    }

    login = (ev) => {
        ev.preventDefault()
        console.log('log in')

        let username = this.username.current.value
        let password = this.password.current.value

        fetch('http://localhost:3000/api/v1/login', {
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
                    this.saveToken(json.jwt)
                    this.getProfile()
                    this.getChannels()
                }
            })
    }

    logout() {
        this.clearToken()
        this.setState({ username: '' })
        return false
    }

    getProfile = () => {
        let token = this.getToken()
        fetch('http://localhost:3000/api/v1/profile', {
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

    getChannels = () => {
        let token = this.getToken()
        fetch('http://localhost:3000/api/v1/channels', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(json => {
                console.log('channels:', json)
                this.setState(prevState => { 
                    return {channels: prevState.channels.concat(json) }})
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
                        channels: {this.state.channels.map(chan => {
                            return chan.name
                        })}
                    </pre>
                </div>}
            </div>
        );
    }
}