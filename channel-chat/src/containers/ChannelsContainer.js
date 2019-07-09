import React, {Component} from 'react'
import ChannelListItem from '../components/ChannelListItem'
import Message from '../components/Message'
import MessageField from '../components/MessageField'

export default class ChannelsContainer extends Component {

    state = {
        channels: [],
        activeChannel: null
    }

    constructor() {
        super()
        this.username = React.createRef()
        this.password = React.createRef()

        if (this.getToken()) {
            this.getChannels()
                this.getProfile()
            

        }
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

    


    getToken(jwt) {
        return localStorage.getItem('jwt')
    } 

    changeChannel = (channel) => {
        this.setState({
            activeChannel: channel,
            messages: channel.messages
        })
    }

    postMessage = (ev) => {
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
                return { messages: prevState.messages.concat(json)} 
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





    render(){

        return (
            <div><br></br>
                <div className="ui grid">
                    <div className="four wide column">
                        <div className="ui vertical fluid tabular menu">
                            <h1>Channels</h1>
                        <div className="ui divider"></div>
                            {
                            this.state.channels.map(chan => {
                               return <ChannelListItem key={chan.id} activeChannel={this.state.activeChannel} channelSelect={this.changeChannel} channel={chan}  />
                            })}
                        </div>
                    </div>
                    <div className="twelve wide stretched column">
                        <div className="ui segment">
                            <div className = "scroll-feed">
                                <div className="ui feed">
                                    {this.state.activeChannel?
                                    this.state.messages.map(m => {
                                    return <Message key={m.id} message={m} />
                                    }):null}
                                </div>
                            </div>
                            {
                                this.state.activeChannel !== null ?
                                <MessageField handleSubmit={this.postMessage} channel={this.state.activeChannel}/> :null
                            }
                          

                        </div>
                    </div>
                </div>
            </div>
        )
    
    }




}
