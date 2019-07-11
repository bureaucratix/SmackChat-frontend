import React, {Component} from 'react'
import ChannelListItem from '../components/ChannelListItem'

import UserPopUp from '../components/UserPopUp'
import Message from '../components/Message'
import Channel from '../components/Channel'
import NewChannelModal from '../components/NewChannelModal'
import AddChannelModal from '../components/AddChannelModal'
import MessageField from '../components/MessageField'
import Thread from '../components/Thread'
import Cable from '../components/Cables';
import { API_ROOT } from '../constants/index';
import { ActionCable } from 'react-actioncable-provider';


export default class ChannelsContainer extends Component {


    constructor() {
        super()
        this.username = React.createRef()
        this.password = React.createRef()

        if (this.getToken()) {
            this.getProfile()
        
        }

        this.state = {
            conversations: [],
            conversation: null,
            messages: [],
                thread: null
        }
    }
    
    
    convertTime = (time) => {
        const months = {
          "01": "Jan",
          "02": "Feb",
          "03": "Mar",
          "04": "Apr",
          "05": "May",
          "06": "Jun",
          "07": "Jul",
          "08": "Aug",
          "09": "Sep",
          "10": "Oct",
          "11": "Nov",
          "12": "Dec",
        }
        const rn = new Date()
        let today = `${String(rn.getFullYear())}-${String(rn.getMonth() + 1).length===2?String(rn.getMonth() + 1):"0"+String(rn.getMonth() + 1)}-${String(rn.getDate())}`;
        const date = time.split("T")[0]
        time = time.split("T")[1]
        let hour = time.split(":")[0]
        let minute = time.split(":")[1]
        if (date === today) {
          return `Today at ${hour}:${minute}`
        }else{
          return `${months[date.split("-")[1]]} ${date.split("-")[2]} at ${hour}:${minute}`
        }
      }

    toggleThread = (message) => {

        this.setState({
            thread: message
        })

        
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
        console.log(this.state)
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
        let width = this.state.thread ? 'seven' : 'twelve'
        return (
            <div><br></br>


                <div className="ui grid">
                    <div className="four wide column">
                        <div className="ui vertical fluid tabular menu">
                            <UserPopUp />
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
                    <div className={`${width} wide right floated column`} >
                        <div className="ui segment">

                            <div className="scroll-feed">
                                <div className="channel-window">
                                    {this.state.conversation ? <Channel convertTime={this.convertTime} toggleThread={this.toggleThread} messages={this.state.conversation.messages} currentChannel={this.state.conversation} /> : null}

                                    <div ref={el => { this.el = el; }} />
                                </div>
                            </div>
                            {
                                this.state.conversation ?
                                    <MessageField placeholder={"Message " + this.state.conversation.name} handleSubmit={this.postMessage} channel={this.state.conversation} /> : null
                            }
                        </div>
                    </div>
                    {/* -----Sidebar for THreads------- */}
                    { this.state.thread?
                    <div className="five wide stretched column">
                        <div className="ui segment">

                            <div className="scroll-feed">
                                <div className="channel-window">
                                    <Thread convertTime={this.convertTime} message={this.state.thread} />
                                </div>
                            </div>
                            {
                             
                                this.state.conversation ?
                                    <MessageField handleSubmit={this.postMessage} channel={this.state.conversation} /> : null
                            }
                        </div>
                        
                    </div>
                    :
                    null}
                </div>
                
            </div>
        )
    }
}
