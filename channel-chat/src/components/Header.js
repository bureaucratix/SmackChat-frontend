import React, {Component} from 'react'
import {Dropdown} from 'semantic-ui-react'
import { BrowserRouter as Route, NavLink } from 'react-router-dom';

export default class Header extends Component {


    render() {
        return(
            <div className="ui secondary pointing menu">
            <div className="header "><h1>SmackChat</h1>

            
                </div>
                <div className="right menu">
                    <a className="ui item">
                        Logout
                    </a>
                </div>
            </div>

        )
    }
}