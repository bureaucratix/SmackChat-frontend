import React, {Component} from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'

export default class UserPopUp extends Component {
  

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
      console.log('prevState:', this.state)
      this.setState({ user: data.user})
    }, () => console.log('state:', this.state))
  }

  

  
  
handleSubmit = (img) => {
  let token = this.getToken()
  let payload = img
  fetch('http://localhost:3000/api/v1/profile)', {
      method: 'PUT',
      headers: {
          'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(payload)
  })
  .then(resp => resp.json())
  .then(data => {
    this.setState({
      user: {
        ...this.state.user,
        img_url: data
      }
    })
  })
}

  handleChange = (event) => {
    this.setState({
      img_url: event.target.value
    })
  }




  render() {

    const ModalModalExample = () => (
      <Modal trigger={<Button>Show Modal</Button>}>
        <Modal.Header>My Account</Modal.Header>
        <Modal.Content image>
          <Image wrapped size='medium' src={this.state.user.ing_url} />
          <Modal.Description>
            <Header>Default Profile Image</Header>
            <p>We've found the following gravatar image associated with your e-mail address.</p>
            <p>Is it okay to use this photo?</p>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    )
    
    return (
      {ModalModalExample}
    )
  }
}
  

