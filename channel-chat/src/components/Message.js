import React, {Component} from 'react'
import Reply from './Reply.js'

class Message extends Component  {

openThread = () => {
    this.props.toggleThread(this.props.message)
}


showReplies = () => {
    return this.props.message.replies.map(m => {
        return <Reply key={m.id} message={m} />
    })
}

 content = this.props.message.content
 user_name = this.props.message.user_name
 created_at = this.props.convertTime(this.props.message.created_at)
    
render() {
    return (
        < div className="event" >
            <div className="label">
                <i className ="user icon"> </i>
            </div>
            <div className="content">
                <div className="summary">
                    <a>{this.user_name} </a> 
                    <div className="date">
                        {this.created_at}
                    </div>
                    <div className="extra text">
                        {this.content}
                    </div>
                </div>
                <div className="extra images"> </div>
                <div className="meta">
                    <a onClick={this.likeOrUnlike}className="like">
                        <i className="like icon"></i> 
                    </a>
                    <a onClick={this.openThread} className="comments-link">
                        {this.props.message.replies.length !== 0 ? 
                            this.props.message.replies.length === 1 ? `1 reply` : `${this.props.message.replies.length} replies`
                         : 
                            'reply to this'}
                    </a>
                </div>
            </div>
            {/* <div className="ui segments">
                {this.props.message.replies ? this.showReplies() : null}
            </div> */}

        </div>
     
    )
}
}

export default Message

