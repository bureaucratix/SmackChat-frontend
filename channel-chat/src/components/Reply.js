import React, { Component } from 'react';

class Reply extends Component {

    render() {
        console.log(this.props.message)
        return (
            <div className="ui segment"> {this.props.message.content} </div>
        )
    }
}

export default Reply;

