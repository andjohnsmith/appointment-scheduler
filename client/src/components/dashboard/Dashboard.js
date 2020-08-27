import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Dashboard = ({ auth: { user }, workout: { workouts } }) => {
  return (
    <Fragment>
      <h1>Dashboard</h1>
      <p className="lead">Welcome {user && user.name}</p>

      <h2>Upcoming Appointments</h2>
      {workouts.length !== 0 ? (
        workouts.forEach((workout) => <div>{workout.type}</div>)
      ) : (
        <div>You haven't scheduled anything yet!</div>
      )}
      <Link to="/add-workout" className="btn btn-primary">
        Schedule
      </Link>
    </Fragment>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  workout: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  workout: state.workout,
});

export default connect(mapStateToProps)(Dashboard);
