import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route } from 'react-router-dom';

import HomePage  from './Containers/HomePage/HomePage.jsx';
import AboutPage from './Containers/AboutPage/AboutPage.jsx';
import LoginPage from './Containers/LoginPage/LoginPage.jsx';
import Layout from './Hoc/Layout/Layout';
import * as actions from './store/actions/index';
import { connect } from 'react-redux';

function App(props) {
  return (
    <Layout>
      <Route exact path='/' component={props => <HomePage {...props} />} />
      <Route path='/about'  component={props => <AboutPage {...props} />} />
      <Route path='/login'  component={props => <LoginPage {...props} />} />
    </Layout>

  );
}


export default App  ;
