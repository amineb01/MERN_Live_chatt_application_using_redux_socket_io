import React, { PropTypes } from 'react';

const ConnectedUsers = ( props ) => (
  <ui className="contacts">
  { props.users && props.users.map(user =>
    <li className={(props.receiver == user?  'active' : '')} onClick={()=>props.clicked(user)} key={user.socketID}>
      <div className="d-flex bd-highlight">
        <div className="img_cont">
          <img src="https://www.khaama.com/wp-content/uploads/2019/02/Afghan-Singer-Ghawgha-Taban-880x672-880x672.jpg" className="rounded-circle user_img" />
          <span className="online_icon"></span>
        </div>
        <div className="user_info">
          <span>{user.email}</span>
          <p>Maryam is online</p>
        </div>
      </div>
    </li>
  )}

  </ui>

);

export default ConnectedUsers ;
