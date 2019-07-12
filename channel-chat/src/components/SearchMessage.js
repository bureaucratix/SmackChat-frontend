import React, {Component} from 'react'

export default class SearchMessage extends Component {
    render() {

    
        return (
           
            <div className="ui feed feed-window segment">
                {this.props.messages.map((message) => 
                    <div key={message.id} className="event" >
                    <div className="label">
                        <i className ="user icon"> </i>
                    </div>
                    <div className="content">
                    <div className="summary">
                            <a>{message.user_name}</a>
                        <div className="date">
                            {message.created_at}
                        </div>
                        <div className="extra text">
                            {message.content}
                        </div>
                    </div>
                    <div className="extra images"> 
                    </div>
                </div>
            </div>)}
                
            </div>
        )
        
    }
}