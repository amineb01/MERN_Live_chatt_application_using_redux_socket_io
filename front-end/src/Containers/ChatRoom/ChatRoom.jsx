
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
      <Container fluid={true} className="chat-container">
        <Row>
        {this.state.receiver &&
          <Col xs={8}>

            <div className="tableContainer">
              <div className="receiver">
                <Alert  variant="primary">
                  {this.state.receiver.email}
                </Alert>
              </div>
              <Messages messages={this.props.messages} connectedUserID={this.props.userId}/>
            </div>

            <InputGroup className="mb-3 bottom-input">
               <FormControl
                 value            ={this.state.msg || ''}
                 name             = 'msg'
                 onChange         ={(event)=>this.handleChange(event.target.name,event.target.value)}
                 placeholder      ="message's content"
                 aria-label       ="message's content"
                 aria-describedby ="basic-addon2"
               />
               <InputGroup.Append>
                 <Button variant="outline-secondary" onClick={this.sendMessage} >Envoyer</Button>
               </InputGroup.Append>
             </InputGroup>

          </Col>
          }
          {!this.state.receiver &&
           <Col xs={8}>
            <div className="no-receiver">
            <p> aucun utilisateur sélectionné </p>
            </div>
           </Col>
          }
          <Col xs={4}>
            <ConnectedUsers clicked={this.selectReceiver} users={this.props.users} />
          </Col>
        </Row>
      </Container>
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
