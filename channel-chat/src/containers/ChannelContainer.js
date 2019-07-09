
import React, { Component } from 'react';
import Channel from '../components/Channel'

class ChannelContainer extends Component {

    render() {
        return (
            <div> 
                <p>I contain Channels. Here's a channel: </p>
                <Channel/>
            </div>
        )
    }
}

export default ChannelContainer;

