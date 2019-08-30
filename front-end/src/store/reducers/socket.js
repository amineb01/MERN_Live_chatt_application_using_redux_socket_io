import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  users : [],

};

const newConnectionSuccess = ( state, action ) => {
    return updateObject( state, { users: action.users } );
};



const reducer = ( state = initialState , action ) => {
  switch ( action.type ) {
      case actionTypes.NEW_CONNECTION   : return newConnectionSuccess(state, action);
      default:
          return state;
  }
}

export default reducer;
