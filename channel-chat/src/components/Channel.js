import React, {Component} from 'react'
import Message from './Message'

export default class Channel extends Component {

    render() {
        <div className="ui segment">
            {this.props.messages.map(message => {
                <Message user={this.props.user}/>
            })}
        </div>
    }
}