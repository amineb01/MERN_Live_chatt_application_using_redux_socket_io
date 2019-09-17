import React from 'react';

class AboutPage extends React.Component {
  componentDidMount(){
    console.log("AboutPagecomponentDidMount");}
  render () {
    return (
      <p> About page donesn't need authentification</p>
    );
  }
}

export default AboutPage;
