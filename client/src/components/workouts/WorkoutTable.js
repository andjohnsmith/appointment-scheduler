import React from 'react';

const WorkoutTable = ({ workouts }) => {
  return workouts.length !== 0 ? (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Time</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {workouts.map((workout) => (
          <tr key={workout._id}>
            <td>{new Date(workout.startDate).toDateString()}</td>
            <td>{`${new Date(workout.startDate).getHours()}:00`}</td>
            <td>
              <button className="btn btn-warning">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div>You haven't scheduled anything yet!</div>
  );
};

export default WorkoutTable;
