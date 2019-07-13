import React from 'react'
import { Button, Header, Modal, Form, Input, Dropdown } from 'semantic-ui-react'
import { API_ROOT } from '../constants/index';
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

        if (this.getToken()) {
            this.getProfile()

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

    componentDidMount() {
        setTimeout(() => {

            let token = this.getToken()
        fetch(`${ API_ROOT }/users`, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(res => res.json())
                .then(json => {
                    let filtered = json.filter(user => user.id !== this.state.user.id)
                    filtered.forEach(function(user) {
                        userOptions.push({
                        value: user, text: user.username,
                        key: user.id})
                    })
                })  
        }, 2000)
    }


    render() {
        return (
    <Modal trigger={<button onClick={this.handleOpen} className="ui basic button">
          <i className="icon hashtag"></i>Create Channel</button>}
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