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

export const clearMessages = (data) => {
    return {
        type    : actionTypes.CLEAR_MESSAGE
      };
};

export const newMessage = ( data ) => {

    return dispatch => {
        dispatch(addNewMessage( data ));
    };
};

export const deleteMessages = ( data ) => {

    return dispatch => {
        dispatch(clearMessages());
    };
};
