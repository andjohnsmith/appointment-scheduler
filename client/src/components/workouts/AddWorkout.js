import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addWorkout } from '../../actions/workout';
import { DateTimePicker } from 'react-datetime-picker';

const AddWorkout = ({ addWorkout, history }) => {
  const [formData, setFormData] = useState({
    type: '',
    startDate: Date.now(),
    trainer: '',
  });

  const { type, startDate, trainer } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Fragment>
      <h1>Add a Workout</h1>
      <small>* = required field</small>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addWorkout(formData, history);
        }}
      >
        <div className="form-group">
          <select className="form-control" value={type} onChange={onChange}>
            <option>Cardio</option>
            <option>Weights</option>
            <option>Yoga</option>
          </select>
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            value={trainer}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <DateTimePicker value={startDate} onChange={onChange} />
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

AddWorkout.propTypes = {
  addWorkout: PropTypes.func.isRequired,
};

export default connect(null, { addWorkout })(AddWorkout);
