import React, {Component} from 'react'
import Message from './Message'

export default class ChannelListItem extends Component {

    handleClick = (ev) => {
        ev.target.className = "active item"
    }

    render() {

        return (
            <a onClick={this.handleClick}className=" item">{this.props.name} </a>
        )
      
    }
}