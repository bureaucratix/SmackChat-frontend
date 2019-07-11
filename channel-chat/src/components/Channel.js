
import React, { Component } from 'react';
import Message from './Message'


class Channel extends Component {

    render() {
        return (
            
            <div className="ui feed feed-window">
                {this.props.messages ? this.props.messages.map(m => {
                    return <Message convertTime={this.props.convertTime} toggleThread={this.props.toggleThread} channelId={this.props.currentChannel.id} key={m.id} message={m} />
                    })
                :
                null
                }
            </div>
        )
        
           
    
    }
}

export default Channel;

