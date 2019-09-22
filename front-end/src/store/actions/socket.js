import axios from 'axios';

import * as actionTypes from './actionTypes';

export const addNewSocketObj = (data) => {
    return {
        type : actionTypes.NEW_SOCKET,
        socket: data.socket
      };
};

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

export const newSocketObj = ( data ) => {

    return dispatch => {
        dispatch(addNewSocketObj( data ));
    };
};

export const deleteMessages = ( data ) => {

    return dispatch => {
        dispatch(clearMessages());
    };
};
