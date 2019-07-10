import React, {Component} from 'react'
import ChannelListItem from '../components/ChannelListItem'
import Channel from '../components/Channel'

export default class ChannelsContainer extends Component {

    state = {
        channels: []
    }

    constructor() {
        super()
        this.username = React.createRef()
        this.password = React.createRef()

        if (this.getToken()) {
            this.getChannels()
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

    


    getToken() {
        return localStorage.getItem('jwt')
    } 

    changeChannel = (channel) => {
        console.log(channel.messages)
        this.setState({
            activeChannel: channel
        })
    }

    render(){

        return (
            <div><br></br>
            <div className="ui grid">
                <div className="four wide column">
                    <div className="ui vertical fluid main menu">
                        <h1>Channels</h1>
                        <div className="ui divider"></div>
                        {
                            this.state.channels.map(chan => {
                               return <ChannelListItem key={chan.id} channelSelect={this.changeChannel} channel={chan}  />
                            })}
                    </div>
                </div>
                <div className="twelve wide stretched column">
                    <div className="ui segment">
                            {this.state.activeChannel ? <Channel currentChannel={this.state.activeChannel} /> : null}
                    </div>
                </div>
            </div>
            </div>
        )
    
    }




}
