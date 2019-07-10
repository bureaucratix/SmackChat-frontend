import React from 'react'

const Message = (props) =>  {

    let    content = props.message.content
    let  user_name = props.message.user_name
    let  created_at = props.message.created_at


  
    return (

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
    );
}

export default Message

