import * as actionTypes from './actionsTypes';
import axios from '../../axios-users';

export const fetchUserSuccess = (user) => {
    return {
        type: actionTypes.FETCH_USER_SUCCESS,
        user: user
    };
};

export const fetchUserFail = (error) => {
    return {
        type: actionTypes.FETCH_USER_FAIL,
        error: error
    };
};

export const fetchUserStart = () => {
    return {
        type: actionTypes.FETCH_USER_START
    };
};

export const fetchUser = () => {
    return dispatch => {
        axios.get('/currentuser')
            .then(res => {
                const fetchedUser = res.data;
                dispatch(fetchUserSuccess(fetchedUser));
            })
            .catch(err => {
                dispatch(fetchUserFail(err));
            });
    }
}
