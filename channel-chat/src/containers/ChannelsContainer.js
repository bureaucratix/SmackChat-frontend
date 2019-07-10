import React, {Component} from 'react'
import $ from 'jquery';
import ChannelListItem from '../components/ChannelListItem'
import Channel from '../components/Channel'
import NewChannelModal from '../components/NewChannelModal'
import AddChannelModal from '../components/AddChannelModal'
import MessageField from '../components/MessageField'

import io from 'socket.io-client';




export default class ChannelsContainer extends Component {

    state = {
        channels: [],
        activeChannel: null,
        messages: [],
    }

    constructor() {
        super()
        this.username = React.createRef()
        this.password = React.createRef()

        if (this.getToken()) {
                this.getProfile()
         
        }
    }


        getUserChannels = (user) => {
            let token = this.getToken()
            fetch('http://localhost:3000/api/v1/user_channels', {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(res => res.json())
                .then(json => {
                    let chanArray = json.filter(userChannel => userChannel.user_id === user.id)
                    this.renderChannels(chanArray)
                 
                })

        }

        renderChannels = (associations) => {
            let token = this.getToken()
            fetch('http://localhost:3000/api/v1/channels', {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(res => res.json())
                .then(json => {
                    let channels = []
                    associations.map(ass => {
                        channels = json.filter(channel => channel.id === ass.channel_id)
                    })
                 
                    console.log('userChannels:', channels)
                    this.setState({
                         channels: channels
                    })
                })
        }

    


    getToken() {
        return localStorage.getItem('jwt')
    } 


    getChannelMessages = (channel) => {
        let token = this.getToken()
        fetch('http://localhost:3000/api/v1/messages', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(json => {
                let currentMessages = json.filter(m => m.channel_id === channel.id)
                
                
                this.setState({
                   messages: currentMessages
                })
                // loader.remove()
            })

    }
    

    changeChannel = (channel) => {
        this.setState({
            activeChannel: channel,
        })

        this.getChannelMessages(channel)
    }

    
    postMessage = (ev) => {
        console.log('posinging')
        ev.preventDefault()
       let content =  ev.target[0].value
        let token = this.getToken()
        fetch('http://localhost:3000/api/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                content: content,
                user_id: this.state.user.id,
                channel_id: this.state.activeChannel.id
            }),
        })
            .then(res => res.json() )
            .then(json => {
                console.log("message", json.message)
                this.setState(prevState => {
                return { messages: prevState.messages.concat(json.message)} 
            })}
            )
        

         
    }   


    getProfile = () => {
        let token = this.getToken()
        fetch('http://localhost:3000/api/v1/profile', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(json => {
                console.log('profile:', json)
                this.setState({ user: json.user })
                 this.getUserChannels(json.user)
            })
    }

    handleChannelCreate = (channel) => {
         console.log(channel)

    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.el.scrollIntoView({ behavior: 'smooth' });
    }

    render(){

        return (
            <div><br></br>

                <div className="ui grid">
                    <div className="four wide column">
                        <div className="ui vertical fluid tabular menu">
                            <h1>#Channels</h1>
                                <br></br>
                            <NewChannelModal handleSubmit={this.handleChannelCreate} />
                            <AddChannelModal />
                            <br></br>
                            <br></br>
                            {
                            this.state.channels.map(chan => {
                               return <ChannelListItem key={chan.id} activeChannel={this.state.activeChannel} channelSelect={this.changeChannel} channel={chan}  />
                            })}
                        </div>
                    </div>
                    <div className="twelve wide stretched column">
                        <div className="ui segment">

                            <div className="scroll-feed">
                                <div className="channel-window">
                                    {this.state.activeChannel ? <Channel messages={this.state.messages} currentChannel={this.state.activeChannel} /> : null}
                                    <div ref={el => { this.el = el; }} />
                                </div>
                            </div>
                            {
                                this.state.activeChannel ?
                                    <MessageField handleSubmit={this.postMessage} channel={this.state.activeChannel} /> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
