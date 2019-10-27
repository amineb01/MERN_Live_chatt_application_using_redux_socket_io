
import Navigation from '../../Components/Navigation/Navigation.jsx';

import React, { PropTypes } from 'react';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
import openSocket from 'socket.io-client';
const socket = openSocket('http://192.168.2.108:9999');
// 192.168.2.108
class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.props.newSocketObj( socket )
  }


  componentDidMount(){
    this.props.onTryAutoSignup ();
    if (!this.props.isAuthenticated) {
      if( this.props.userId && this.props.email){
        this.subscribeToChanel( { userId:this.props.userId, email:this.props.email } )
      }
    }

  }

  subscribeToChanel( user ){
    socket.emit('subscribeToChanel', user );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.userId !== this.props.userId && this.props.userId ) {
      this.subscribeToChanel( { userId:this.props.userId, email:this.props.email } )
      socket.on('event1', data =>{
          this.addMessageToArray( data )
        });
      socket.on('newConnection', data =>{
        console.log("newConnection",data)
        this.props.newConnections( data )
      });
      socket.on('disconnect', data =>{
        console.log("disconnect",data)

        this.props.newConnections( data )
        // this.props.removeConnection( data )
        socket.disconnect();
      });
    }
  }

    addMessageToArray = ( data ) => {
      this.props.newMessage( { receiver:data.receiver, msg: data.msg, sender:data.sender } )
    }
  render () {
    return (
      <div>
        <Navigation />
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    email: state.auth.email,
    userId: state.auth.userId,
    users: state.socket.users,
    messages: state.socket.messages
  };
};


const mapDispatchToProps = dispatch => {
  return {
    newConnections : ( users ) => dispatch(actions.connections( { users:users} )),
    onTryAutoSignup: () => dispatch( actions.authCheckState() ),
    newMessage     : ( data ) => dispatch(actions.newMessage({ message:data } )),
    newSocketObj   : ( data ) => dispatch(actions.newSocketObj({ socket:data } ))

  };
};

export default connect( mapStateToProps, mapDispatchToProps )( Layout ) ;
