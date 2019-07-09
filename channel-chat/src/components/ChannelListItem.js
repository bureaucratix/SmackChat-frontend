import React, {Component} from 'react'
import Message from './Message'

export default class ChannelListItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            channel: this.props.channel
        }
    }

    handleClick = (ev) => {
        ev.target.className = "active item"
        this.props.channelSelect(this.state.channel)
    }

    render() {

        return (
            <a onClick={this.handleClick}className=" item">{this.state.channel.name} </a>
        )
      
    }
}