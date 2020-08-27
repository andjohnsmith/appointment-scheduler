import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import api from '../../utils/api';
import { addWorkout } from '../../actions/workout';

const AddWorkout = ({ addWorkout, history }) => {
  const [date, setDate] = useState(new Date());
  const [openTimes, setOpenTimes] = useState({
    7: true,
    8: true,
    9: true,
    10: true,
    11: true,
    12: true,
    13: true,
    14: true,
    15: true,
    16: true,
    17: true,
    18: true,
  });

  const getTimes = async () => {
    console.log('current date: ' + date.toDateString());

    // search workouts with date
    try {
      const res = await api.get(`/workouts?date=${date.toDateString()}`);

      if (res.data[0] === -1) {
        // all time slots are open
        return;
      }

      const workouts = res.data;
      console.log('going through data');
      for (const workout in workouts) {
        const startDate = new Date(workouts[workout].startDate);
        console.log('time: ' + startDate.getHours());
        setOpenTimes({
          ...openTimes,
          [startDate.getHours()]: false,
        });
      }
    } catch (err) {
      console.log(err.response.statusText);
    }
  };

  const submit = (time) => {
    setDate(date.setHours(time));
    addWorkout({ startDate: date }, history);
  };

  return (
    <Fragment>
      <h1>Add a Workout</h1>
      <div>
        <Calendar value={date} onChange={setDate} />
        <button type="button" onClick={getTimes}>
          Search Times
        </button>
      </div>

      <h2>Available Workouts</h2>
      {Object.keys(openTimes).map((time) =>
        openTimes[time] === true ? (
          <div key={time}>
            <span>{time}</span>
            <button onClick={() => submit(time)}>Add</button>
          </div>
        ) : (
          <span key={time}>{time} is taken</span>
        ),
      )}

      <Link className="btn btn-light my-1" to="/dashboard">
        Go Back
      </Link>
    </Fragment>
  );
};

AddWorkout.propTypes = {
  addWorkout: PropTypes.func.isRequired,
};

export default connect(null, { addWorkout })(AddWorkout);
