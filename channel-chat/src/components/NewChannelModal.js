import React from 'react'
import { Button, Header, Modal, Form, Input, Search } from 'semantic-ui-react'

const userOptions = []


class ModalModalExample extends React.Component {

    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => this.setState({ modalOpen: false })


    constructor() {
        super()
        this.state = {
            channelName: '',
            channelUsers: [],
            modalOpen: false
        }
    }

    handleSubmit = () => {
        this.props.handleSubmit(this.state)
        this.handleClose()
    }
    getToken() {
        return localStorage.getItem('jwt')
    } 

    handleChange = (ev, {value}) => {
        if(Array.isArray(value)) {
            this.setState({
                channelUsers: value
            })
        } else {
            this.setState({
                channelName: value
            })
        }
        
    }   

    componentDidMount() {
            let token = this.getToken()
            fetch('http://localhost:3000/api/v1/users', {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(res => res.json())
                .then(json => {
                    console.log('users:', json)
                    json.forEach(function(user) {
                        userOptions.push({
                        value: user.username, text: user.username,
                        key: user.id})
                    })
                })  
    }


    render() {
        return (
    <Modal trigger={<button onClick={this.handleOpen} className="ui basic button">  <i className="icon hashtag"></i>Create Channel</button>}
                open={this.state.modalOpen}
                onClose={this.handleClose}
                >
        <Modal.Header>Create A Channel</Modal.Header>
        <Modal.Content>
            <Modal.Description>
                <Header>Channel Info</Header>
                <Form id="new-chanel-form">
                    <Form.Group widths='equal'>
                        <Form.Field
                            onChange={this.handleChange}
                            id='channelName'
                            control={Input}
                            label='#Channel name'
                            placeholder='Channel name'
                        />
                    </Form.Group>
                    <Form.Dropdown
                        onChange={this.handleChange}
                        id='channelUsers'
                        placeholder='Friends'
                        fluid
                        multiple
                        search
                        selection
                        options={userOptions}
                    />
                    < Form.Field
                        onClick={this.handleSubmit}
                        id='form-button-control-public'
                        control={Button}
                        content='Create Channel'
                    />
                    
                </Form>
            </Modal.Description>
        </Modal.Content>
    </Modal>

        )
    }
}

export default ModalModalExample