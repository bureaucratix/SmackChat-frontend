import React from 'react';
import Login from '../containers/Login';
import SignUp from '../components/SignUp';
import NewChannelModal from '../components/NewChannelModal';
import ChannelsContainer from './ChannelsContainer'

class Primary extends React.Component {

    getToken() {
        return localStorage.getItem('jwt')
    } 

    render() {
        
        return (
            <div className="App">
                <main>
                    <div className="header">
                        <h1>SmackChat</h1>
                    </div>
                    {this.getToken() == undefined? <div><SignUp /><Login /></div>:<ChannelsContainer createChannel={this.addChannel} />}
                    
                    
                    
                </main>
            </div>
    
        );
    }
}

export default Primary;