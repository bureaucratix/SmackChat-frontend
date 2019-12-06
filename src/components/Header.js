import React, {Component} from 'react'
import {Dropdown} from 'semantic-ui-react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export default class Header extends Component {



    render() {
        return(
            <div className="ui secondary pointing menu">
            <div className="header "><h1>SmackChat</h1>

            
            </div>

                <div className="right menu">
                    {this.props.user?
                        <a className="ui item">
                            You're logged in!--
                            <Link onClick={this.props.logout} to="/login" >Logout</Link>
                        </a>

                    : 
                        <a className="ui item">
                            Not Logged In---
                            <Link to="/login" >Login</Link>
                        </a>
                    }
                </div>
            </div>

        )
    }
}