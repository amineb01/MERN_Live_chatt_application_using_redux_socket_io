
import Navigation from '../../Components/Navigation/Navigation.jsx';

import React, { PropTypes } from 'react';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';

class Layout extends React.Component {
  componentDidMount(){
    this.props.onTryAutoSignup ();
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
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {

    onTryAutoSignup: () => dispatch( actions.authCheckState() )
  };
};

export default connect( mapStateToProps, mapDispatchToProps )( Layout ) ;
