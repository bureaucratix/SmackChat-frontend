import React from 'react'

const Message = (props) =>  {

    return (
        <div className="ui segment">
            {props.user.username}
            {props.message.content}
        </div>
    );
}

export default Message