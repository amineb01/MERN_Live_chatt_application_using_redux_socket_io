import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import  './Navigation.css';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';


const Navigation = ( props ) => (
  <div>
    <ul className="navigation grid grid-gutters large-grid-fit med-grid-fit small-grid-1of2">
      <li className="grid-cell">
         <Link className="navigation-link navigation-brand" to="/">
           Home
         </Link>
      </li>
      { props.isAuthenticated &&
       <li className="grid-cell">
        <Link className="navigation-link navigation-brand" to="/chatRoom">
          Chat Room
        </Link>
       </li>
      }
      { !props.isAuthenticated &&
         <li className="grid-cell">
          <Link className="navigation-link navigation-brand" to="/login">
            Login
          </Link>
        </li>
      }
        <li className="grid-cell">
          <Link className="navigation-link navigation-brand" to="/about">
            About
          </Link>
      </li>
      { props.isAuthenticated &&
       <li className="grid-cell" onClick={()=>{props.socket.emit('unsubscribeToChanel', props.socket.id ) ; props.onLogout()} }>
        Logout
       </li>
      }
    </ul>
  </div>
);

  const mapStateToProps = (state) => {
    return {
      isAuthenticated: state.auth.token !== null,
      authRedirectPath: state.auth.authRedirectPath,
      socket: state.socket.socket
    }
  }
  const mapDispatchToProps = dispatch => {
      return {
          onLogout: ( ) => dispatch( actions.logout() )
      };
  };

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
