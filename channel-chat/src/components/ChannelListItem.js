import React, {Component} from 'react'

export default class ChannelListItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            channel: this.props.channel,
        }
    }

    handleClick = (ev) => {
        this.props.channelSelect(this.state.channel)
    }

    render() {

        return (
            <a onClick={this.handleClick} className={this.state.channel === this.props.activeChannel? 'active item': 'item'}>{this.state.channel.name} </a>
        )
      
    }
}