import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, isLoading }, logout }) => {
  const authLinks = (
    <Fragment>
      <div className="navbar-nav">
        <Link to="/profiles" className="nav-link">
          Trainers
        </Link>
        <Link to="/workouts" className="nav-link">
          Workouts
        </Link>
        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>
      </div>
      <div className="ml-auto">
        <button onClick={logout} className="btn btn-primary">
          Logout
        </button>
      </div>
    </Fragment>
  );

  const guestLinks = (
    <div className="navbar-nav ml-auto">
      <Link to="/profiles" className="nav-link">
        Trainers
      </Link>
      <Link to="/register" className="nav-link">
        Register
      </Link>
      <Link to="/login" className="nav-link">
        Login
      </Link>
    </div>
  );

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Bookit
        </Link>
        <button className="navbar-toggler" type="button">
          <span className="navbar-toggler-icon"></span>
        </button>
        {!isLoading && (
          <div className="collapse navbar-collapse">
            {isAuthenticated ? authLinks : guestLinks}
          </div>
        )}
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
