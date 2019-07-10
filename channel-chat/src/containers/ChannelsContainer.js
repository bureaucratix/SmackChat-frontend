import React, {Component} from 'react'
import $ from 'jquery';
import ChannelListItem from '../components/ChannelListItem'
import Channel from '../components/Channel'
import NewChannelModal from '../components/NewChannelModal'
import AddChannelModal from '../components/AddChannelModal'
import MessageField from '../components/MessageField'
import Cable from '../components/Cables';
import { API_ROOT } from '../constants/index';
import { ActionCable } from 'react-actioncable-provider';





export default class ChannelsContainer extends Component {

    state = {
        conversations: [],
        conversation: null,
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


    componentDidMount() {
        this.scrollToBottom();
        this.getChannelsAndMessages();
    }

    getChannelsAndMessages = () => {
        fetch(`${API_ROOT}/api/v1/channels`)
            .then(res => res.json())
            .then(conversations => {

                this.setState({ conversations })
            });
    }



        getUserChannelIds = (user) => {
         console.log(user)
            let token = this.getToken()
            fetch('http://localhost:3000/api/v1/user_channels', {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(res => res.json())
                .then(json => {
                let filtered =  json.filter(userChannel => userChannel.user_id === user.id)
                    return filtered        
                })
                .catch(err => console.log(err))
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
    

    changeChannel = (channel) => {
        console.log('Active Channel: ', channel)
        this.setState({
            conversation: channel,
        })

        
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
                channel_id: this.state.conversation.id
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
                //  this.getUserChannels(json.user)
            })
    }

    handleChannelCreate = (channel) => {
         console.log(channel)

    }



    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.el.scrollIntoView({ behavior: 'smooth' });
    }

    handleReceivedConversation = response => {
        const { conversation } = response;
        this.setState({
            conversations: [...this.state.conversations, conversation]
        });
    };

    handleReceivedMessage = response => {
        const { message } = response;
        const conversations = [...this.state.conversations];
        const conversation = conversations.find(
            conversation => conversation.id === message.channel_id
        );
            console.log(conversation)
        conversation.messages = [...conversation.messages, message];
        this.setState({ conversations });
    };


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
                            <ActionCable
                                channel={{ channel: 'ChannelsChannel' }}
                                onReceived={this.handleReceivedConversation}
                            />
                            {this.state.conversations.length ? (
                                <Cable
                                    conversations={this.state.conversations}
                                    handleReceivedMessage={this.handleReceivedMessage}
                                />
                            ) : null}

                            
                            {
                            this.state.conversations.map(chan => {
                               return <ChannelListItem key={chan.id} conversation={this.state.conversation} channelSelect={this.changeChannel} channel={chan}  />
                            })}
                        </div>
                    </div>
                    <div className="twelve wide stretched column">
                        <div className="ui segment">

                            <div className="scroll-feed">
                                <div className="channel-window">
                                    {this.state.conversation ? <Channel messages={this.state.conversation.messages} currentChannel={this.state.conversation} /> : null}
                                    <div ref={el => { this.el = el; }} />
                                </div>
                            </div>
                            {
                                this.state.conversation ?
                                    <MessageField handleSubmit={this.postMessage} channel={this.state.conversation} /> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
