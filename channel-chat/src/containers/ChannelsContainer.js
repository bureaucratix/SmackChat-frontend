import React, {Component} from 'react'
import $ from 'jquery';
import ChannelListItem from '../components/ChannelListItem'
import Channel from '../components/Channel'
import NewChannelModal from '../components/NewChannelModal'
import MessageField from '../components/MessageField'
import Thread from '../components/Thread'

export default class ChannelsContainer extends Component {


    constructor() {
        super()
        this.username = React.createRef()
        this.password = React.createRef()

        if (this.getToken()) {
            this.getChannels()
            this.getProfile()
        
        }

        this.state = {
                channels: [],
                activeChannel: null,
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


    getChannels = () => {
        let token = this.getToken()
        fetch('http://localhost:3000/api/v1/channels', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(json => {
                console.log('channels:', json)
                this.setState(prevState => {
                    return { channels: prevState.channels.concat(json) }
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
            .then(json => 
                this.setState(prevState => {
                return { messages: prevState.messages.concat(json.message)} 
            })
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
            })
    }

    handleChannelCreate = (ev) => {
    
       
        // ev.preventDefault()
        // let content = ev.target[0].value
        // let token = this.getToken()
        // fetch('http://localhost:3000/api/v1/channels', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Bearer ' + token
        //     },
        //     body: JSON.stringify({
        //         content: content,
        //         user_id: this.state.user.id,
        //         channel_id: this.state.activeChannel.id
        //     }),
        // })
        //     .then(res => res.json())
        //     .then(json =>
        //         this.setState(prevState => {
        //             return { channels: prevState.channels.concat(json.channel) }
        //         })
        //     )

    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
        console.log(this.state)
    }

    scrollToBottom() {
        this.el.scrollIntoView({ behavior: 'smooth' });
    }

    render(){
        let width = this.state.thread ? 'seven' : 'twelve'
        return (
            <div><br></br>

                <div className="ui grid">
                    <div className="four wide column">
                        <div className="ui vertical fluid tabular menu">
                            <h1>#Channels</h1>
                                <br></br>
                            <NewChannelModal handleSubmit={this.handleChannelCreate} />
                            <br></br>
                            <br></br>
                            {
                            this.state.channels.map(chan => {
                               return <ChannelListItem key={chan.id} activeChannel={this.state.activeChannel} channelSelect={this.changeChannel} channel={chan}  />
                            })}
                        </div>
                    </div>
                    <div className={`${width} wide right floated column`} >
                        <div className="ui segment">

                            <div className="scroll-feed">
                                <div className="channel-window">
                                    {this.state.activeChannel ? <Channel convertTime={this.convertTime} toggleThread={this.toggleThread} messages={this.state.messages} currentChannel={this.state.activeChannel} /> : null}
                                    <div ref={el => { this.el = el; }} />
                                </div>
                            </div>
                            {
                                this.state.activeChannel ?
                                    <MessageField placeholder={"Message " + this.state.activeChannel.name} handleSubmit={this.postMessage} channel={this.state.activeChannel} /> : null
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
                                this.state.activeChannel ?
                                    <MessageField handleSubmit={this.postMessage} channel={this.state.activeChannel} /> : null
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
