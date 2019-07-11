import React from 'react'
import { Button, Header, Image, Modal, Form, Input, Select, Dropdown } from 'semantic-ui-react'
import { API_ROOT } from '../constants/index';

let userOptions = []

class ModalModalExample extends React.Component {

    handleOpen = () => {
        userOptions = []
        this.props.channelUsers.forEach(function (user) {
            userOptions.push({
                value: user, text: user.username,
                key: user.id
            })
        })
        this.setState({ modalOpen: true })}

    handleClose = () => this.setState({ modalOpen: false })


    constructor() {
        super()
        this.state = {

            modalOpen: false
        }
    }

    render() {
        return (
            <Modal trigger={<button onClick={this.handleOpen} className="ui basic button">  <i className="icon hashtag"></i>Users</button>}
                open={this.state.modalOpen}
                onClose={this.handleClose}
            >
                <Modal.Header>Search Channel for Users</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Header>Channel Users</Header>
                        <Dropdown
                            placeholder='Select Channel'
                            fluid
                            search
                            selection
                            options={userOptions}
                        />
                        <br></br>
                        <Button>Random</Button>
                    </Modal.Description>
                </Modal.Content>
            </Modal>

        )
    }
}

export default ModalModalExample