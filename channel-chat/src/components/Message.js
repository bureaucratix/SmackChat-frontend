import React from 'react'

const Message = (props) =>  {

    return (
        <div className="ui segment">
            {props.message.user_id}
            {props.message.content.toString()}
        </div>
    );
}

export default Message