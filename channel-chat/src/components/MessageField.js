import React from 'react'
const MessageField = (props) => {

    return (

        <form className="ui form" onSubmit={props.handleSubmit} >
            <div className="field">
                <input type="text" name="message-box" placeholder={props.placeholder}></input>
            </div>

        </form>
    )
}

export default MessageField

