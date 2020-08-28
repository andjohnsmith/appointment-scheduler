import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getWorkouts } from '../../actions/workout';
import WorkoutTable from '../workouts/WorkoutTable';

const Dashboard = ({ getWorkouts, auth: { user }, workout: { workouts } }) => {
  useEffect(() => {
    getWorkouts();
  }, [getWorkouts]);

  return (
    <Fragment>
      <div className="jumbotron jumbotron-fluid mt-4">
        <div className="container">
          <h1 className="display-4">Your Dashboard</h1>
          <p className="lead">Welcome, {user && user.name}</p>
        </div>
      </div>

      <div className="row mb-2">
        <div className="col">
          <span className="h2">Upcoming Workouts</span>
        </div>
        <div className="col">
          <Link to="/workouts" className="btn btn-secondary">
            See all
          </Link>
        </div>
        <div className="col">
          <Link to="/add-workout" className="btn btn-primary">
            Add
          </Link>
        </div>
      </div>
      <WorkoutTable workouts={workouts} />
    </Fragment>
  );
};

Dashboard.propTypes = {
  getWorkouts: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  workout: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  workout: state.workout,
});

export default connect(mapStateToProps, { getWorkouts })(Dashboard);
