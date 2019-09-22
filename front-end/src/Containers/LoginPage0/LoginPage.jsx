import React from 'react';
import { Link } from 'react-router';
import { Form,Button } from "react-bootstrap";
import "./Login.css";
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';


class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formValid: false,
      formErrors: { email: '', password: '' },
      email: "",
      password: "",
      emailValid :false,
      passwordValid :false,
      isSignup:false
    };
  }



  validateField(fieldName, value) {
   let fieldValidationErrors = this.state.formErrors;
   let emailValid = this.state.emailValid? true : false ;
   let passwordValid = this.state.passwordValid? true : false ;

   switch(fieldName) {
     case 'email':
       emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
       fieldValidationErrors.email = emailValid ? '': ' email invalide';
       break;

     case 'password':
       passwordValid = value.length >= 3;
       fieldValidationErrors.password = passwordValid ? '': ' le champ entrée est invalide';
       break;

     default:
       break;
     }
     this.setState({ formErrors: fieldValidationErrors,
                     emailValid: emailValid,
                     passwordValid: passwordValid
                   }, this.validateForm);
  }

 validateForm() {
   this.setState({ formValid: this.state.emailValid && this.state.passwordValid });
  }


  handleUserInput (name,value) {
    this.setState({[name]: value},
     () => { this.validateField(name, value) });

  }

  onKeyPress=(event)=> {
    if (event.which === 13 /* Enter */ && !this.state.formValid) {
       event.preventDefault();
    }
  }

  submitHandler = ( event ) => {
    event.preventDefault();
    this.props.onAuth( this.state.email, this.state.password, this.state.isSignup )
  }


  render() {
    let authRedirect = null;
    if (this.props.isAuthenticated) {
        authRedirect = <Redirect to={ this.props.authRedirectPath }/>
    }
    return (
      <div className="Login">
        {this.props.error ? <p className="login_msg err_msg" > {this.props.error} </p> : '' }
        { authRedirect }
        <Form onKeyPress={this.onKeyPress} onSubmit={this.submitHandler} >
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              autoFocus
              type="email"
              name="email"
              value={this.state.email}
              onChange={(event) => this.handleUserInput(event.target.name,event.target.value)}
             />
            <Form.Text className="text-muted err_msg">
              {this.state.formErrors.email}.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              value={this.state.password}
              onChange={(event) => this.handleUserInput(event.target.name,event.target.value)}
              type="password"
              name="password"
             />
             <Form.Text className="text-muted err_msg">
               {this.state.formErrors.password}.
             </Form.Text>
          </Form.Group>
          <Form.Group controlId="formBasicChecbox">
            <Form.Check
              type="checkbox"
              label="sign up"
              value ={this.state.isSignup}
              onChange={e => this.setState({ isSignup: !this.state.isSignup })}
               />
          </Form.Group>
          <Button
             block
             bssize="large"
             disabled={!this.state.formValid}
             type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}



const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: ( email, password, isSignup ) => dispatch( actions.auth( email, password, isSignup ) ),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
