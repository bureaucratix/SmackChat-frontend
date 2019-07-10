import React, {Component} from 'react'
import Reply from './Reply.js'
class Message extends Component  {

showReplies = () => {
    return this.props.message.replies.map(m => {
        return <Reply key={m.id} message={m} />
    })
}
    
render() {
    return (
        <>
        <div className="ui segment">
            {this.props.message.user_id}
            {this.props.message.content.toString()}
        </div>
        <div className="ui segments">
            {this.props.message.replies ? this.showReplies() : null}
        </div>
        </>
    );
}
}

export default Message