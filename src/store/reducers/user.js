import * as actionTypes from '../actions/actionsTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    user: {},
    loading: false,
};

const fetchUserStart = (state, action) => {
    return updateObject(state, { loading: true });
};

const fetchUserSuccess = (state, action) => {
    return updateObject(state, {
        user: action.user,
        loading: false
    });
};

const fetchUserFail = (state, action) => {
    return updateObject(state, { loading: false });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_USER_START: return fetchUserStart(state, action);
        case actionTypes.FETCH_USER_SUCCESS: return fetchUserSuccess(state, action);
        case actionTypes.FETCH_USER_FAIL: return fetchUserFail(state, action);
        default: return state;
    }
};
export default reducer;
