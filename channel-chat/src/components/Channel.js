
import React, { Component } from 'react';
import Message from './Message'


class Channel extends Component {
    constructor() {
        super();
        this.state = {
        };
    }

    render() {
        return (
            <div className="ui feed feed-window">
            {this.props.currentChannel.messages.map(m => {
                    return <Message key={m.id} message={m} />
                })
            }
            </div>
        )
        
           
    
    }
}

export default Channel;

