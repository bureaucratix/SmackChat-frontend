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

    let content = ""
    let user_name = ''
    let created_at = ""
    if(props.message.content == undefined) {
         content = props.message.message.content
        user_name = props.message.message.user_name
        created_at = props.message.message.created_at
    } else {
         content = props.message.content
        user_name = props.message.user_name
        created_at = props.message.created_at
    }

        < div className="event" >
            <div className="label">
                <i className ="user icon"> </i>
            </div>
            <div className="content">
                <div className="summary">
                    <a>{user_name}</a>
                    <div className="date">
                        {created_at}
                    </div>
                    <div className="extra text">
                        {content}
                    </div>
                </div>
                <div className="extra images"> </div>
                <div className="meta">
                    <a className="like">
                        <i className="like icon"></i> 
                            </a>
                </div>
            </div>

        </div>
        <div className="ui segments">
            {this.props.message.replies ? this.showReplies() : null}
        </div>
        </>
    );
}
}

export default Message

