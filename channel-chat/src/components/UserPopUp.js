import React, { Component } from 'react'
import { Button, Modal, Header, Image} from 'semantic-ui-react'

class UserPopUp extends Component {
  state = { 
    open: false,
    user: '' }
  

    componentDidMount() {
    this.fetchUser()
  }

  getToken = () => {
    return localStorage.getItem('jwt')
  }

    fetchUser = () => {
    let token = this.getToken()
    fetch('http://localhost:3000/api/v1/profile', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(resp => resp.json())
    .then(data => {
      console.log('prevState', this.state)
      this.setState({
        user: data.user
      }, () => console.log('state', this.state))
      
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const token = this.getToken();
    const payload = {user: this.state.user};
    const config = {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + token},
      body: JSON.stringify(payload)
    };
    fetch(`http://localhost:3000/api/v1/users/${this.state.user.id}`, config)
    .then(resp => resp.json())
    .then(data => {
      console.log(data)
    })
  }


  handleChange = (event) => {
    this.setState({
      user: {
        ...this.state.user,
        img_url: event.target.value
      }
    })
  }


  show = size => () => this.setState({ size, open: true })
  close = () => this.setState({ open: false })

  render() {
    const { open, size } = this.state

    return (
      <div>
        
        <Button onClick={this.show('fullscreen')}>Profile</Button>

        <Modal size={size} open={open} onClose={this.close}>
          <Modal.Header>My Profile</Modal.Header>
          <Modal.Content image>
            <Image wrapped size='medium' src={this.state.user.img_url} />
            <Modal.Description>
              <Header>Default Profile Image</Header>
              <p>We've found the following gravatar image associated with your e-mail address.</p>
              <p>Is it okay to use this photo?</p>
              <form onSubmit={this.handleSubmit}>
              <label>
                Add or Edit Profile Image:
                <input type="text" value={this.state.user.img_url} onChange={this.handleChange}/>
              </label>
            </form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button negative>No</Button>
            <Button positive icon='checkmark' labelPosition='right' content='Yes' />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

export default UserPopUp