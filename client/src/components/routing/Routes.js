import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Alert from '../layout/Alert';
import Dashboard from '../dashboard/Dashboard';
import PrivateRoute from '../routing/PrivateRoute';
import AddWorkout from '../workouts/AddWorkout';
import Workouts from '../workouts/Workouts';
import Trainers from '../profiles/Trainers';

const Routes = (props) => {
  return (
    <section className="container">
      <Alert />
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/trainers" component={Trainers} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/workouts" component={Workouts} />
        <PrivateRoute exact path="/add-workout" component={AddWorkout} />
      </Switch>
    </section>
  );
};

export default Routes;
