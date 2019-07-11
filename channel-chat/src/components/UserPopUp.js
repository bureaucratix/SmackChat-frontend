import React, { Component } from 'react'
import { Button, Modal, Header, Image} from 'semantic-ui-react'
import { API_ROOT } from '../constants/index';


class UserPopUp extends Component {
  state = { 
    open: false,
    user: {} }
  

    componentDidMount() {
    this.fetchUser()
  }

  getToken = () => {
    return localStorage.getItem('jwt')
  }

    fetchUser = () => {
    let token = this.getToken()
      fetch(`${API_ROOT}/profile`, {
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
      headers: { 
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };
    fetch(`${ API_ROOT }/users/${this.state.user.id}`, config)
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
            <Image wrapped size='medium'  />
            <Modal.Description>
              <Header>Dashboard</Header>
              {this.state.user ? <div className= "ui card"><p>This is Your Current Profile Image</p>
                <img className="ui small image"src={this.state.user.img_url}></img></div>:null}
             

              <br></br>
              <p>Is it okay to use this photo?</p>
              <form className="ui form"onSubmit={this.handleSubmit}>
                <label>
                  Add/Edit Image;
                  <input type="text" className="ui field" placeholder="Add Image URL" value={this.state.value} onChange={this.handleChange}/>
                  <br></br>
                  <br></br>
                  <br></br>
                  <input className="ui button save"type="submit" value="Save Changes"></input>
                </label>
              </form>

            </Modal.Description>
          </Modal.Content>
        </Modal>
      </div>
    )
  }
}

export default UserPopUp