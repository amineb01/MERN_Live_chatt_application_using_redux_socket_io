import React, { PropTypes } from 'react';

const ConnectedUsers = ( props ) => (
  <div className="ConnectedUsers" >
    <div className="tableContainer">
      <table className="table">
        <tbody>
        { props.users && props.users.map(user =>
          <tr onClick={()=>props.clicked(user)} key={user.socketID}>
            <td>{user.email}</td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  </div>
);

export default ConnectedUsers ;
