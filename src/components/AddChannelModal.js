import React from 'react'
import { Button, Header, Image, Modal, Form, Input, Select, Dropdown } from 'semantic-ui-react'
import { API_ROOT } from '../constants/index';


class ModalModalExample extends React.Component {

    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => this.setState({ modalOpen: false })


    constructor() {
        super()
        this.state = {
            channels: [],
            channelOptions: [],
            channel: null,

            modalOpen: false
        }

        if (this.getToken()) {
            this.getProfile()

        }
    }


    
    componentDidMount() {
        this.getChannels()
      
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


    getChannelOptions(channels) {
        let options = []
        channels.map(chan => {
           let obj = {value: chan, text: chan.name, key: chan.id}
            options.push(obj)
        })

        this.setState({
            channelOptions: options
        })
    }


    getChannels = () => {
        let token = this.getToken()
        fetch(`${API_ROOT}/channels`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(json => {
                this.getChannelOptions(json)
                this.setState(prevState => {
                    return { channels: json }
                   
                })
            })
    }



    getToken() {
        return localStorage.getItem('jwt')
    }


    handleChange = (ev, { value }) => {
            this.setState({
                channel: value
            })

    }

    
    handleChannelAdd = () => {
        this.handleClose()
        let channel = this.state.channel
        this.props.handleUserChannelAdd(channel)
    }



    render() {
        return (
            <Modal trigger={<button onClick={this.handleOpen} className="ui basic button">  <i className="icon hashtag"></i>Add Channel</button>}
                open={this.state.modalOpen}
                onClose={this.handleClose}
            >
                <Modal.Header>Search for a Channel to Add</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Header>Channel Name</Header>
                        <Dropdown 
                            onChange={this.handleChange}
                            placeholder='Select Channel'
                            fluid
                            search
                            selection
                            options={this.state.channelOptions}
                        />
                        <br></br>
                        <Button onClick={this.handleChannelAdd}>Add Channel</Button>
                    </Modal.Description>
                </Modal.Content>
            </Modal>

        )
    }
}

export default ModalModalExample