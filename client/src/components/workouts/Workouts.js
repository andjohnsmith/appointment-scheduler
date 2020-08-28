import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getWorkouts, deleteWorkout } from '../../actions/workout';

const Workouts = ({ getWorkouts, deleteWorkout, workout: { workouts } }) => {
  useEffect(() => {
    getWorkouts();
  }, [getWorkouts]);

  return (
    <Fragment>
      {workouts.length !== 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((workout) => (
              <tr key={workout._id}>
                <td>{new Date(workout.startDate).toDateString()}</td>
                <td>{`${new Date(workout.startDate).getHours()}:00`}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => deleteWorkout(workout._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>You haven't scheduled anything yet!</div>
      )}

      <Link to="/add-workout" className="btn btn-primary">
        Add Workout
      </Link>
    </Fragment>
  );
};

Workouts.propTypes = {
  getWorkouts: PropTypes.func.isRequired,
  deleteWorkout: PropTypes.func.isRequired,
  workout: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  workout: state.workout,
});

export default connect(mapStateToProps, { getWorkouts, deleteWorkout })(
  Workouts,
);
