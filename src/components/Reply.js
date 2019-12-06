import React, { Component } from 'react';

class Reply extends Component {

    render() {
        return (
            <div className="ui segment"> {this.props.message.content} </div>
        )
    }
}

export default Reply;

