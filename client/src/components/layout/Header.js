import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Header = ({ auth: { isAuthenticated, isLoading }, logout }) => {
  const authLinks = (
    <Fragment>
      <Link to="/dashboard" className="nav-link">
        Dashboard
      </Link>
      <Link to="/workouts" className="nav-link">
        Workouts
      </Link>
      <Link to="/trainers" className="nav-link">
        Trainers
      </Link>
      <button onClick={logout} className="nav-link">
        Logout
      </button>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <Link to="/trainers" className="nav-link">
        Trainers
      </Link>
      <Link to="/register" className="nav-link">
        Register
      </Link>
      <Link to="/login" className="nav-link">
        Login
      </Link>
    </Fragment>
  );

  return (
    <header className="masthead mb-auto">
      <div className="inner">
        <Link className="h3 masthead-brand" to="/">
          Trainr
        </Link>
        <nav className="nav nav-masthead justify-content-center">
          {!isLoading && (isAuthenticated ? authLinks : guestLinks)}
        </nav>
      </div>
    </header>
  );
};

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Header);
