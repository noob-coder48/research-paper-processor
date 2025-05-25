import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import UploadPDF from './components/UploadPDF';
import MyAppBar from './components/MyAppBar';

function App() {
  return (
    <Router>
      <MyAppBar />
      <Switch>
        <Route path="/" exact>
          <Redirect to="/login" />
        </Route>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/upload" component={UploadPDF} />
      </Switch>
    </Router>
  );
}

export default App;