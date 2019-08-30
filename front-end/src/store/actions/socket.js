import axios from 'axios';

import * as actionTypes from './actionTypes';



export const newConnections = (data) => {
    return {
        type : actionTypes.NEW_CONNECTION,
        users: data.users
      };
};

export const connections = ( data ) => {
    return dispatch => {
        dispatch(newConnections( data ));
    };
};
