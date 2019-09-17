import React, { PropTypes } from 'react';
import "./Messages.css";

const Messages = ( props ) => (
  <table className="table table-striped">
    <tbody>

    {props.messages && props.messages.map((message,index) =>

      <tr  key={index} >
        <td  className={ (props.connectedUserEmail === message.sender? 'own_msg ' : '')} >{message.msg}</td>
      </tr>
    )}
    </tbody>
  </table>
);

export default Messages ;
