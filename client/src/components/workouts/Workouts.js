import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WorkoutTable from './WorkoutTable';

const Workouts = ({ workout: { workouts } }) => {
  return (
    <Fragment>
      <WorkoutTable workouts={workouts} />

      <Link to="/add-workout" className="btn btn-primary">
        Add Workout
      </Link>
    </Fragment>
  );
};

Workouts.propTypes = {
  workout: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  workout: state.workout,
});

export default connect(mapStateToProps)(Workouts);
