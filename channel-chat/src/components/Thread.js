import React, { Component } from 'react'
import { API_ROOT } from '../constants/index';
import { Divider, Button } from 'semantic-ui-react';
// import { Button, Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'

export default class Thread extends Component {

    constructor() {
        super()

        this.state = {
            user_img_url: null,
            content:null,
            user_name:null,
            created_at:null
        }

    }
    

    getToken = () => {
        return localStorage.getItem('jwt')
    } 


    handleImage = () => {
        let token = this.getToken()
        fetch(`${API_ROOT}/users/${this.props.message.user_id})`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })        
        .then(resp => resp.json())
        .then(data => {
            this.setState({
                user_img_url: data.img_url
            })
        })
        }

    componentDidMount() {

        this.handleImage()
        if (this.props.message){
            this.setState({
            content: this.props.message.content,
            user_name: this.props.message.user_name,
            created_at: this.props.convertTime(this.props.message.created_at)
            })
        }
    }


    render(){
        return (
            <div className="ui feed feed-window segment">
                <button onClick={this.props.close} className="ui small icon button">
                    <i className="close icon"></i>
                </button>
                <div className="event" >
                    <div className="label">
                        {this.state.user_img_url? <img className="ui mini image" src={this.state.user_img_url} alt=''/>: <i className ="user icon"> </i>} 
                    </div>
                    <div className="content">
                        <div className="summary">
                            <a>{this.state.user_name}</a>
                            <div className="date">
                                {this.state.created_at}
                            </div>
                            <div className="extra text">
                                {this.state.content}
                            </div>
                        </div>
                        <div className="extra images"> </div>
                    </div>
                </div>

                {/* loop through replies of this.props.message.replies and map to these divs */}
                    <h4 class="ui horizontal divider header">
                    <i class="mail icon"></i>
                    Replies
                    </h4>
                    {this.props.message.replies ? this.props.message.replies.map(m => {
                    return <div>
                        <div className="ui right align">
                            <div className="summary">                              
                                <a>{this.props.users[m.user_id]}  </a>
                                <div className="reply-time ui date inline ">
                                    {this.props.convertTime(m.created_at)}
                                </div>
                                <div className="extra text right align">
                                    {m.content}
                                </div>
                            </div>
                        </div>
                        <div class="ui horizontal divider"/>
                    </div>
                        //  <Message convertTime={this.props.convertTime} toggleThread={this.props.toggleThread} channelId={this.props.currentChannel.id} key={m.id} message={m} />
                    })
                :
                null
                }
                    
                    
            </div>
        
        )
    }
              
    
    }
