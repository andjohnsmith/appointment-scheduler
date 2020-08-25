import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Dashboard = ({ auth: { user }, workout: { workouts } }) => {
  return (
    <Fragment>
      <h1>Dashboard</h1>
      <p className="lead">Welcome {user && user.name}</p>

      <h2>Interests</h2>
      <p>What kind of exercise do you want to schedule?</p>

      <h2>Upcoming Appointments</h2>
      {workouts.length !== 0 ? (
        workouts.forEach((workout) => <div>{workout.type}</div>)
      ) : (
        <div>You haven't scheduled anything yet!</div>
      )}
      <button className="btn btn-primary">Schedule</button>
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
