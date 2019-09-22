
import React from 'react';
import "./ChatRoom.css";
import { InputGroup, FormControl, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from '../../store/actions/index';
import openSocket from 'socket.io-client';
import Messages from '../../Components/messages/Messages.jsx';
import ConnectedUsers from '../../Components/ConnectedUsers/ConnectedUsers.jsx';
import axios from 'axios';
const socket = openSocket('http://192.168.2.108:9999');


class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.selectReceiver = this.selectReceiver.bind(this);
    this.state = {
      receiver: null,
      msg     : null,
    };
  }

  componentDidMount(){

    if (!this.props.isAuthenticated) {
      // if( this.props.userId && this.props.email){
      //   console.log (this.props.userId)
      //   this.subscribeToChanel( { userId:this.props.userId, email:this.props.email } )
      // }
      socket.on('event1', data =>{

        let receiver   =this.props.users.find((element) => {  return element.email=== data.receiver})
        if(receiver){
          this.selectReceiver(receiver)
          this.addMessageToArray( data )
        }
      });
    }


  }

  subscribeToChanel( user ){
    socket.emit('subscribeToChanel', user );
  }
  addMessageToArray = ( data ) => {
    this.props.newMessage( { receiver:data.receiver, msg: data.msg, sender:data.sender } )
  }


  selectReceiver(user){
    this.setState({ receiver: user })
    this.loadMessages(user)
  }


  loadMessages= (user) => {
    this.props.deleteMessages();
    let axiosConfig = {
       headers:{'x-token': localStorage.getItem('token'),'sender': this.props.userId, 'receiver':user.userId }
     }
    axios.get('http://192.168.2.108:9999/api/messages', axiosConfig)
        .then(response => {
          response.data.map(message => this.addMessageToArray( { receiver:message.receiver._id, msg: message.msg, sender:message.sender._id } ));
        })
        .catch(err => {
          // dispatch( authFail( err.response.data.message ) );
        });
  }
  sendMessage = () => {
    console.log("ee");

    socket.emit('event1', { receiver:this.state.receiver.email, msg: this.state.msg, sender:this.props.email, socketId:socket.id })
    // this.addMessageToArray( { receiver:this.state.receiver.email, msg: this.state.msg, sender:this.props.email } )

  }

  handleChange(name,value) {
    this.setState({[name]: value})
  }

  render () {
    let authRedirect = null;
    if (!this.props.isAuthenticated) {
        authRedirect = <Redirect to='/login'/>
    }
    return (
      <div className="ChatRoom">
      { authRedirect }
      <div className="container-fluid h-100">
        <div className="row justify-content-center h-100">
          <div className="col-md-4 col-xl-3 chat"><div className="card mb-sm-3 mb-md-0 contacts_card">
            <div className="card-header">
              <div className="input-group">
                <input type="text" placeholder="Search..." name="" className="form-control search" />
                <div className="input-group-prepend">
                  <span className="input-group-text search_btn"><i className="fas fa-search"></i></span>
                </div>
              </div>
            </div>
            <div className="card-body contacts_body">
              <ConnectedUsers receiver={this.state.receiver} clicked={this.selectReceiver} users={this.props.users} />
            </div>
            <div className="card-footer"></div>
          </div></div>
          <div className="col-md-8 col-xl-6 chat">
            <div className="card">
              <div className="card-header msg_head">
                <div className="d-flex bd-highlight">
                  <div className="img_cont">
                    <img src="https://www.khaama.com/wp-content/uploads/2019/02/Afghan-Singer-Ghawgha-Taban-880x672-880x672.jpg" className="rounded-circle user_img" />
                    <span className="online_icon"></span>
                  </div>
                  {this.state.receiver &&
                  <div className="user_info">
                    <span>{"Chat with "+this.state.receiver.email}</span>
                    <p>1767 Messages</p>
                  </div>
                  }
                  <div className="video_cam">
                    <span><i className="fas fa-video"></i></span>
                    <span><i className="fas fa-phone"></i></span>
                  </div>
                </div>
                <span id="action_menu_btn"><i className="fas fa-ellipsis-v"></i></span>
                <div className="action_menu">
                  <ul>
                    <li><i className="fas fa-user-circle"></i> View profile</li>
                    <li><i className="fas fa-users"></i> Add to close friends</li>
                    <li><i className="fas fa-plus"></i> Add to group</li>
                    <li><i className="fas fa-ban"></i> Block</li>
                  </ul>
                </div>
              </div>
              <div className="card-body msg_card_body">
                <Messages messages={this.props.messages} connectedUserID={this.props.userId}/>

              </div>
              <div className="card-footer">
                <div className="input-group">
                  <div className="input-group-append">
                    <span className="input-group-text attach_btn"><i className="fas fa-paperclip"></i></span>
                  </div>
                  <textarea
                  value            ={this.state.msg || ''}
                  name             = 'msg'
                  onChange         ={(event)=>this.handleChange(event.target.name,event.target.value)}
                  className="form-control type_msg" placeholder="Type your message..."></textarea>
                  <div className="input-group-append" onClick={this.sendMessage}>
                    <span className="input-group-text send_btn" ><i className="fas fa-location-arrow"></i></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
      newMessage     : ( data ) => dispatch(actions.newMessage({ message:data } )),
      deleteMessages     : ( data ) => dispatch(actions.deleteMessages())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom);
