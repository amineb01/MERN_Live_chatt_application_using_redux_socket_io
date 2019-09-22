import axios from 'axios';

import * as actionTypes from './actionTypes';

import { connection } from './index';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};


export const authSuccess = (token, userId, email) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        email: email,
        userId: userId
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};


export const logout = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};


export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());

        const authData = {
            email: email,
            password: password,
        };
        let url = 'http://192.168.2.108:9999/api/admins';
        if (!isSignup) {
            url = 'http://192.168.2.108:9999/api/auth';
        }
        axios.post(url, authData)
            .then(response => {
                if (!response.data.is_successful) {
                  dispatch(authFail(response.data.message));
                }
                else {
                  const expirationDate = new Date(new Date().getTime() + response.data.result.expiresIn * 60 * 1000);
                  debugger
                  localStorage.setItem( 'token', response.data.result.token );
                  localStorage.setItem( 'expirationDate', expirationDate );
                  localStorage.setItem( 'userId', response.data.result._id );
                  localStorage.setItem( 'email', response.data.result.email );
                  dispatch( authSuccess( response.data.result.token, response.data.result._id, response.data.result.email  ) );
                  dispatch( checkAuthTimeout( response.data.result.expiresIn ) );
                }
            })
            .catch(err => {
              dispatch( authFail( err.response.data.message ) );
            });
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                const userId = localStorage.getItem('userId');
                const email = localStorage.getItem('email');
                dispatch(authSuccess(token, userId, email));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
            }
        }
    };
};
