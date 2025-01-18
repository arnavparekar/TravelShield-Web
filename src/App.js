import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Home from "./pages/Home";
import List from "./pages/List"
import UserDashboard from "./pages/UserDashboard";
import WorldMap from "./pages/WorldMap";
import SignIn from "./pages/SignIn";
import Header from './components/Header';
import './App.css';



function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/list" component={List} />
        {/* <Route path="/user-dashboard" component={UserDashboard} /> */}
        <Route path="/user-dashboard/:userId" component={UserDashboard} />
        <Route path="/world-map" component={WorldMap} />
        <Route path="/sign-in" component={SignIn} />
      </Switch>
    </Router>
  );
}

export default App;

