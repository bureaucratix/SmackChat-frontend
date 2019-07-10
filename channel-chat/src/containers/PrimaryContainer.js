import React from 'react';
import Login from '../containers/Login';
import SignUp from '../components/SignUp';
import ChannelsContainer from './ChannelsContainer'

function Primary() {
    return (
        <div className="App">
            <main>
                <div className="header">
                    <h1>SmackChat</h1>
                </div>
                {/* <SignUp/> */}
                {/* <Login /> */}
                <ChannelsContainer />
            </main>
        </div>

    );
}

export default Primary;