import api from '../utils/api';
import { setAlert } from './alert';
import {
  GET_WORKOUTS,
  WORKOUT_ERROR,
  DELETE_WORKOUT,
  ADD_WORKOUT,
  GET_WORKOUT,
} from '../actions/types';

export const getWorkouts = () => async (dispatch) => {
  try {
    const res = await api.get('/workouts');

    dispatch({
      type: GET_WORKOUTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: WORKOUT_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

export const getWorkout = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/workouts/${id}`);

    dispatch({
      type: GET_WORKOUT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: WORKOUT_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

export const addWorkout = (formData, history) => async (dispatch) => {
  try {
    const res = await api.post('/workouts', formData);

    dispatch({
      type: ADD_WORKOUT,
      payload: res.data,
    });

    dispatch(setAlert('Workout Created', 'success'));

    history.push('/dashboard');
  } catch (err) {
    dispatch({
      type: WORKOUT_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

export const deleteWorkout = (id) => async (dispatch) => {
  try {
    await api.delete(`/workouts/${id}`);

    dispatch({
      type: DELETE_WORKOUT,
      payload: id,
    });

    dispatch(setAlert('Workout Removed', 'success'));
  } catch (err) {
    dispatch({
      type: WORKOUT_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};
