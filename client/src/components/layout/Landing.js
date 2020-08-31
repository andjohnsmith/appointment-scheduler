import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <main role="main" className="inner cover">
      <h1>Schedule a workout. Easy.</h1>
      <p className="lead">
        Open up the calendar and find the soonest available workout session, or
        pick out a time in the future. It's easy, and you always know who your
        trainer is.
      </p>
      <p className="lead">
        <Link to="/register" className="btn btn-lg btn-secondary mr-2">
          Register
        </Link>
        <Link to="/login" className="btn btn-lg btn-secondary">
          Login
        </Link>
      </p>
    </main>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
