import React, {Component} from 'react'

export default class UserPopUp extends Component {
  constructor() {
    super()
    this.state = {user: {
      username: '',
      name:'',
      email: '',
      img_url: ''
    }
  }
}

  componentDidMount() {
    this.fetchUser()
  }

  getToken = () => {
    return localStorage.getItem('jwt')
  }

  

  fetchUser = () => {
    let token = this.getToken()
    fetch('http://localhost:3000/api/v1/profile)', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(resp => resp.json())
    .then(data => {
      this.setState({user: data.user})
    })
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
    return (
      <div className="ui modal">
        <i className="close icon"></i>
        <div className="header">
        My Account
        </div>
        <div className="image content">
          <div className="ui medium image">
            <img src={this.state.user.img_url} alt=''/>
          </div>
          <div className="description">
            <div className="ui header">We've auto-chosen a profile image for you.</div>
              <p>We've grabbed the following image from the <a href="https://www.gravatar.com" target="_blank">gravatar</a> image associated with your registered e-mail address.</p>
              <p>Is it okay to use this photo?</p>
           </div>
           <form onSubmit={this.handleSubmit}>
            <label>
              Image Link
              <input type="text" value={this.state.user.img_url} onChange={this.handleChange}/>
            </label>
            <input className="ui secondary button" type="submit" value="submit" />
           </form>
           
        </div>
          <div className="actions">
            <div className="ui positive right labeled icon button">
              Done Editing
              <i className="checkmark icon"></i>
            </div>
          </div>
      </div>
    )
  }
}
  

