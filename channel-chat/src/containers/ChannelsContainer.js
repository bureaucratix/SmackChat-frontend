import React, {Component} from 'react'
import ChannelListItem from '../components/ChannelListItem'

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

    


    getToken(jwt) {
        return localStorage.getItem('jwt')
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
                               return <a className="item"><ChannelListItem name={chan.name} /></a> 
                            })}
                    </div>
                </div>
                <div className="twelve wide stretched column">
                    <div className="ui segment">
                      
                    </div>
                </div>
            </div>
            </div>
        )
    
    }




}
