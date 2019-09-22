import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  socket: null,
  users : [],
  messages : []
};

const newSocketSuccess = ( state, action ) => {
    return updateObject( state, { socket: action.socket } );
};

const newConnectionSuccess = ( state, action ) => {
    return updateObject( state, { users: action.users } );
};

const newMessageSuccess = ( state, action ) => {
    let messagesArray = [... state.messages]
    messagesArray.push (action.message)
    return updateObject( state, { messages: messagesArray } );
};

const clearMessages = ( state, action ) => {
    return updateObject( state, { messages: [] } );
};

const reducer = ( state = initialState , action ) => {
  switch ( action.type ) {
      case actionTypes.NEW_SOCKET       : return newSocketSuccess(state, action);
      case actionTypes.NEW_CONNECTION   : return newConnectionSuccess(state, action);
      case actionTypes.NEW_MESSAGE      : return newMessageSuccess(state, action);
      case actionTypes.CLEAR_MESSAGE    : return clearMessages(state, action);

      default:
          return state;
  }
}

export default reducer;
