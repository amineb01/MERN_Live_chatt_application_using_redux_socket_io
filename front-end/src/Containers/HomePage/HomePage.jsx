
import React, { PropTypes } from 'react';
import "./HomePage.css";
import { InputGroup, FormControl, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from '../../store/actions/index';
import openSocket from 'socket.io-client';
const socket = openSocket('http://192.168.1.3:9999');


class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      receiver: null
    };
  }

  componentDidMount(){

    if( this.props.userId && this.props.email){
      this.subscribeToChanel( { userId:this.props.userId, email:this.props.email } )
    }

    socket.on('event1', data =>{
      this.addMessageToArray( data )
    });

    socket.on('newConnection', data =>{
      this.props.newConnections( data )
    });
  }

  addMessageToArray = ( data ) => {
    let messagesArray = [...this.state.messages]
    messagesArray.push (data)
    this.setState({ messages: messagesArray })
  }

  subscribeToChanel( user ){
    socket.emit('subscribeToChanel', user );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps !== prevState && this.props.userId ) {

      this.subscribeToChanel( { userId:this.props.userId, email:this.props.email } )
    }
  }

  selectReceiver(user){
    console.log(user);
    this.setState({ receiver: user })
  }
  render () {
    let authRedirect = null;
    if (!this.props.isAuthenticated) {
        authRedirect = <Redirect to='/login'/>
    }
    return (
      <div className="HomePage">
      { authRedirect }
      <Container fluid={true} className="chat-container">
        <Row>
          <Col xs={8}>
          <div className="tableContainer">

            {this.state.receiver &&
              <div className="receiver">
                <Alert  variant="primary">
                  {this.state.receiver.email}
                </Alert>
             </div>
            }

            <table className="table table-striped">
              <tbody>
              <tr>
                <td>@twitter</td>
              </tr>
              <tr>
                <td>@twitter</td>
              </tr>

              </tbody>
              </table>
            </div>
            <InputGroup className="mb-3 bottom-input">
               <FormControl
                 placeholder="message's content"
                 aria-label="message's content"
                 aria-describedby="basic-addon2"
               />
               <InputGroup.Append>
                 <Button variant="outline-secondary">Envoyer</Button>
               </InputGroup.Append>
             </InputGroup>
          </Col>
          <Col xs={4}>
            <div className="ConnectedUsers" >
              <div className="tableContainer">
                <table className="table">
                  <tbody>
                  {this.props.users && this.props.users.map(user =>
                    <tr onClick={()=>this.selectReceiver(user)} key={user.socketID}>
                      <td>{user.email}</td>
                    </tr>
                   )}
                  </tbody>
                </table>
              </div>
            </div>
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
        users: state.socket.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
      newConnections: (users) => dispatch(actions.connections({users:users}))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
