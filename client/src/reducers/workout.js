import {
  GET_WORKOUTS,
  WORKOUT_ERROR,
  DELETE_WORKOUT,
  ADD_WORKOUT,
  GET_WORKOUT,
} from '../actions/types';

const initialState = {
  workouts: [],
  workout: null,
  isLoading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_WORKOUTS:
      return {
        ...state,
        workouts: payload,
        isLoading: false,
      };
    case GET_WORKOUT:
      return {
        ...state,
        workout: payload,
        isLoading: false,
      };
    case ADD_WORKOUT:
      return {
        ...state,
        workouts: [payload, ...state.workouts],
        isLoading: false,
      };
    case DELETE_WORKOUT:
      return {
        ...state,
        workouts: state.workouts.filter((workout) => workout._id !== payload),
        isLoading: false,
      };
    case WORKOUT_ERROR:
      return {
        ...state,
        error: payload,
        isLoading: false,
      };
    default:
      return state;
  }
}
