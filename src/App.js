import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import RegistrationForm from "./Components/RegistrationForm/RegistrationForm";
import LoginForm from "./Components/LoginForm/LoginForm";
import AlertComponent from "./Components/AlertComponent/AlertComponent";

import React, {useState} from "react";
import Header from "./Components/Header/Header";
import PrivateRoute from "./Components/PrivateRoute";
import MainPage from "./Components/MainPage/MainPage";


function App() {
  const [errorMessage, updateErrorMessage] = useState(null);

  return (
      <Router>
        <div className="App">
          <Header/>
          <Switch>
            <Route path="/" exact={true}>
              <RegistrationForm showError={updateErrorMessage}/>
            </Route>
            <Route path="/register">
              <RegistrationForm showError={updateErrorMessage}/>
            </Route>
            <Route path="/login">
              <LoginForm showError={updateErrorMessage}/>
            </Route>
            <Route path="/home">
              <MainPage/>
            </Route>
          </Switch>
          <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage}/>
        </div>
      </Router>
  );
}

export default App;
