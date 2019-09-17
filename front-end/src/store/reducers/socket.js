import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  users : [],
  messages : []
};

const newConnectionSuccess = ( state, action ) => {
    return updateObject( state, { users: action.users } );
};

const newMessageSuccess = ( state, action ) => {
    let messagesArray = [... state.messages]
    messagesArray.push (action.message)
    return updateObject( state, { messages: messagesArray } );
};


const reducer = ( state = initialState , action ) => {
  switch ( action.type ) {
      case actionTypes.NEW_CONNECTION   : return newConnectionSuccess(state, action);
      case actionTypes.NEW_MESSAGE      : return newMessageSuccess(state, action);
      default:
          return state;
  }
}

export default reducer;
