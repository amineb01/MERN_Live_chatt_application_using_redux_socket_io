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


export const addNewMessage = (data) => {
    return {
        type    : actionTypes.NEW_MESSAGE,
        message: data.message
      };
};

export const newMessage = ( data ) => {

    return dispatch => {
        dispatch(addNewMessage( data ));
    };
};
