import React from 'react'
import { Button, Header, Image, Modal, Form, Input, Select, Dropdown } from 'semantic-ui-react'

const userOptions = []


class ModalModalExample extends React.Component {
    getToken() {
        return localStorage.getItem('jwt')
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
    <Modal trigger={<button className="ui basic button">  <i className="icon hashtag"></i>Add Channel</button>}>
        <Modal.Header>Create A Channel</Modal.Header>
        <Modal.Content>
            <Modal.Description>
                <Header>Channel Info</Header>
                <Form id="new-chanel-form" onSubmit={this.props.handleSubmit}>
                    <Form.Group widths='equal'>
                        <Form.Field
                            id='form-input-control-channel-name'
                            control={Input}
                            label='#Channel name'
                            placeholder='Channel name'
                        />
                    </Form.Group>
                    <Form.Dropdown
                        id='form-input-control-users-name'
                        placeholder='Friends'
                        fluid
                        multiple
                        search
                        selection
                        options={userOptions}
                    />
                    <Form.Field
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