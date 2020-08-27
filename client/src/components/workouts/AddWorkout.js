import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import api from '../../utils/api';
import { addWorkout } from '../../actions/workout';

import 'react-calendar/dist/Calendar.css';

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

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const res = await api.get(`/workouts?date=${date.toDateString()}`);
        const newOpenTimes = {
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
        };

        if (res.data[0] !== -1) {
          const workouts = res.data;

          for (const workout in workouts) {
            const startDate = new Date(workouts[workout].startDate);

            newOpenTimes[startDate.getHours()] = false;
          }
        }

        setOpenTimes(newOpenTimes);
      } catch (err) {
        console.log(err.response.statusText);
      }
    };

    fetchTimes();
  }, [date]);

  const submit = (time) => {
    addWorkout({ startDate: date.setHours(time) }, history);
  };

  return (
    <Fragment>
      <h1>Add a Workout</h1>
      <div>
        <Calendar value={date} onChange={setDate} minDate={new Date()} />
      </div>

      <h2>Available Workouts</h2>
      {Object.keys(openTimes).map((time) =>
        openTimes[time] === true ? (
          <div key={time}>
            <span>{time}</span>
            <button onClick={() => submit(time)}>Add</button>
          </div>
        ) : (
          <div key={time}>{time} is taken</div>
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
