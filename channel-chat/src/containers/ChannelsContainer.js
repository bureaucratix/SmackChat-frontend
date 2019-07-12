import React, {Component} from 'react'
import ChannelListItem from '../components/ChannelListItem'
import Notifier from 'react-desktop-notification'
import UserPopUp from '../components/UserPopUp'
import ChannelUsersModal from '../components/ChannelUsersModal'
import Channel from '../components/Channel'
import NewChannelModal from '../components/NewChannelModal'
import AddChannelModal from '../components/AddChannelModal'
import MessageField from '../components/MessageField'
import SearchMessage from '../components/SearchMessage'
import Thread from '../components/Thread'
import Cable from '../components/Cables';
import { API_ROOT } from '../constants/index';
import { ActionCable, ActionCableConsumer } from 'react-actioncable-provider';
import { Form } from 'semantic-ui-react';


export default class ChannelsContainer extends Component {


    constructor() {
        super()
        this.username = React.createRef()
        this.password = React.createRef()

        if (this.getToken()) {
            this.getProfile()
        
        }

        this.state = {
            userConversations: [],
            conversations: [],
            conversation: null,
            messages: [],
            thread: null,
            threadVisible: false,

            query: '',
            searched: false,
            deleteOptions: []

        }
    }

    componentDidMount() {
        this.scrollToBottom();
        this.getChannelsAndMessages();
        
    }

    componentDidUpdate() {
        this.scrollToBottom();
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

  
    setUserDictionary = () => {
        let userDict = {}
        fetch(`${API_ROOT}/users`)
            .then(res => res.json())
            .then(json => {
                json.map(user=>{
                userDict[user.id] = user.username
                return userDict
            })
            });
        console.log(userDict)
        return userDict
    }

    getChannelsAndMessages = () => {
        fetch(`${API_ROOT}/channels`)
            .then(res => res.json())
            .then(conversations => {
                
                let userConvos =  []
                conversations.map(conv => {
                    conv.users.map(user => {
                        if(user.id === this.state.user.id) {
                            userConvos.push(conv)
                        } 
                    })
                })
                this.setState({ conversations: conversations, 
                userConversations: userConvos})
            });
    }


    getToken() {
        return localStorage.getItem('jwt')
    } 

   
    changeChannel = (channel) => {
        this.setState({
            conversation: channel,
        })
    }

    toggleThread = (message) => {
        this.setState({
            thread: message,
            threadVisible: !this.state.threadVisible,
            searched: false
        })
    }

    
    postMessage = (ev) => {
        ev.preventDefault()
       let content =  ev.target[0].value
        let token = this.getToken()
        fetch(`${API_ROOT}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                content: content,
                user_id: this.state.user.id,
                channel_id: this.state.conversation.id, 
                likes: 0
            }),
        })
        ev.target.reset()
         
    }   

    postReply = (ev) => {
        ev.preventDefault()
        let content =  ev.target[0].value
        let token = this.getToken()
        fetch(`${API_ROOT}/replies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                content: content,
                user_id: this.state.user.id,
                message_id: this.state.thread.id
            }),
        })
            // .then(res => res.json() )
            // .then(json => {
            //     console.log(json)
            //     // this.setState(prevState => {
            //     // return { messages: prevState.messages.concat(json.message)} 
            // // })
            // })

        ev.target.reset()
         
    }  


    getProfile = () => {
        let token = this.getToken()
        fetch(`${API_ROOT}/profile`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(json => {
                this.setState({ user: json.user })
            })
    }

    handleChannelCreate = (channel) => {
        this.handleAddingUsersToChannels(channel)
        let name = '#' + channel.channelName
        let token = this.getToken()
        fetch(`${API_ROOT}/channels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
              name: name
            }),
        })
            .then(res => res.json())
            .then(json => {
                this.setState(prevState => {
                    return { conversations: prevState.conversations.concat(json.channel),
                    userConversations: prevState.userConversations.concat(json.channel)}
                })
                this.handleAddingUsersToChannels(channel, json.channel.id)
            }
            )
    }

    handleAddingUsersToChannels = (channel, id) => {
        let token = this.getToken()
        let allUsers = channel.channelUsers.concat(this.state.user)
        allUsers.map(user => {
            fetch(`${API_ROOT}/user_channels`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    user_id: user.id,
                    channel_id: id
                }),
            })
        })
    }



    scrollToBottom() {
        this.el.scrollIntoView({ behavior: 'smooth' });
    }


    handleReceivedConversation = response => {
        const { conversation } = response;
        if(conversation !== undefined) {
            this.setState({
                conversations: [...this.state.conversations, conversation.channel]
            });
        }
       
    };

    handleReceivedMessage = response => {
        const { message } = response;
        const conversations = [...this.state.conversations];
        const conversation = conversations.find(
            conversation => conversation.id === message.channel_id
        );
        
        conversation.messages = [...conversation.messages, message]; 
        this.setState({ conversations });
                Notifier.start(conversation.name, message.content, '/', 'https://static.thenounproject.com/png/30135-200.png') 
    };


    handleMessageSearch = (event) => {
        this.setState({query: event.target.value, searched: true, threadVisible:false})
        let searchResults = []
        this.state.conversations.forEach((conversation) => {
           conversation.messages.forEach((message) => {
                if (message.content.toLowerCase().includes(this.state.query.toLowerCase())) {
                    searchResults.push(message)
                }
           })
        })
        this.setState({
            filtered: searchResults
        })

    }

    handleMessageSearchSubmit = (event) => {
        event.preventDefault()
        this.setState({query: ''})
    }

    handleSearchClear = () => {
        this.setState({searched: false})
    }


    addUserChannels = (channel) => {
        let token = this.getToken()
        let user = this.state.user
       
        fetch(`${API_ROOT}/user_channels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ channel_id: channel.id, user_id: user.id })
        }).then(this.setState(prevState => {
            return {userConversations: prevState.userConversations.concat(channel)}
        }))
    }

    getUserChannels = () => {
        let token = this.getToken()
        fetch(`${API_ROOT}/user_channels`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
        })
        .then(res => res.json())
        .then(json => {
            let filtered = json.filter(user_chan => {
                return user_chan.user_id == this.state.user.id
            })
            this.setState({
                deleteOptions: filtered
            })
        })
    
    }

    handleChannelDelete = () => {
        this.getUserChannels()
        let association
        let token = this.getToken()
        setTimeout(() => {
            let userChans = this.state.deleteOptions
            console.log('test', userChans)
            
           console.log(this.state.conversation.id)
            association = userChans.filter(uc => {
                return uc.channel_id === this.state.conversation.id
            })

               fetch(`${API_ROOT}/user_channels/${association[0].id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            },
        }).then(this.setState({
            conversation: null
        }))


      
        }, 500)
     
    }


    render(){
        let width = this.state.threadVisible || this.state.searched ? 'seven' : 'twelve'

        return (
            <div>

                <div className= "ui secondary menu">
                    <div className="right menu">
                        <form onSubmit={this.handleMessageSearchSubmit}>
                            <div className="item">
                                <div className="ui icon input">
                                    <input type="text"  placeholder="Search Messages..." value={this.state.query} onChange={this.handleMessageSearch}/>
                                    {!this.state.searched && this.state.query===""? <i className="search link icon"></i>:<i onClick={this.handleSearchClear} className="chevron up link icon"/>
                                    }
                                </div>
                            </div>
                        </form>
                        </div>
                    </div>
                <div className="ui grid">

                    <div className="four wide column channel-nav">

                        <div className="ui vertical fluid tabular menu">
                            <UserPopUp />
                            
                            <h1 className = 'header'>#Channels</h1>
                                <br></br>

                            <NewChannelModal handleSubmit={this.handleChannelCreate} />
                            <AddChannelModal handleUserChannelAdd={this.addUserChannels}/>
                            <br></br>
                            <br></br>
                            <ActionCableConsumer
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

                            this.state.userConversations.map(chan => {
                                    return <ChannelListItem key={chan.id} conversation={this.state.conversation} channelSelect={this.changeChannel} channel={chan} />   
                            })}

                        </div>
                    </div>
                    <div className={`${width} wide right floated column`} >

                        <div className="ui segment channel-container">

                            {this.state.conversation ? <div className="header"><div className="ui secondary menu"><h3>{this.state.conversation.name}</h3><div className ="right menu"><ChannelUsersModal deleteChannel={this.handleChannelDelete}channelUsers={this.state.conversation.users}/></div></div></div> : null}
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

                    {/* -----Sidebar for Threads------- */}
                    { !this.state.threadVisible && this.state.searched?
                    <div className="five wide stretched column">
                        <div className="ui segment">
                            <div className="scroll-feed">
                                <div className="channel-window">
                                    <SearchMessage messages={this.state.filtered}/>
                                </div>
                            </div>
                        </div>
                    </div>:null}
                    { this.state.threadVisible && !this.state.searched?


                    <div className="five wide stretched column">
                        <div className="ui segment">

                            <div className="scroll-feed">
                                <div className="channel-window">
                                    <Thread users={this.setUserDictionary()} convertTime={this.convertTime} message={this.state.thread} />

                                </div>
                            </div>
                            {
                                this.state.conversation ?
                                    <MessageField handleSubmit={this.postReply} placeholder={"Reply to this thread"} channel={this.state.conversation} /> : null
                            }
                        </div>
                        
                    </div>
                    :
                    null}
                    {}
                </div>
                
            </div>
        )
    }
}
