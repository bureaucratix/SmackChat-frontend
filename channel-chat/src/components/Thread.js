import React, { Component } from 'react'

import { Divider } from 'semantic-ui-react';
// import { Button, Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'

export default class Thread extends Component {


content = this.props.message.content
user_name = this.props.message.user_name
created_at = this.props.convertTime(this.props.message.created_at)
    render(){
        return (
            <div className="ui feed feed-window segment">
                <div className="event" >
                    <div className="label">
                        <i className ="user icon"> </i>
                    </div>
                    <div className="content">
                        <div className="summary">
                            <a>{this.user_name}</a>
                            <div className="date">
                                {this.created_at}
                            </div>
                            <div className="extra text">
                                {this.content}
                            </div>
                        </div>
                        <div className="extra images"> </div>
                      
                    </div>
                </div>
                    <div className="ui segment right align">
                        <div className="summary">
                                <a>{this.user_name}  </a>
                                <div className="date inline">
                                    {this.created_at}
                                </div>
                                <div className="extra text right align">
                                    Hello 1
                                </div>
                            </div>
                        
                    </div>
                    
            </div>
        
        )
    }
              
    
    }
