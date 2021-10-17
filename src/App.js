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
import TicketSelectionPage from "./Components/TicketSelectionPage/TicketSelectionPage";
import MoviesManagePage from "./Components/MoviesManagePage/MoviesManagePage";
import AddMovie from "./Components/MoviesManagePage/AddMovie";
import TicketTypesManagePage from "./Components/TicketTypesManagePage/TicketTypesManagePage";
import AddTicketType from "./Components/TicketTypesManagePage/AddTicketType";
import AddScreening from "./Components/ScreeningManage/AddScreening";
import AuditoriumsManagePage from "./Components/AuditoriumManage/AuditoriumsManagePage";
import AddAuditorium from "./Components/AuditoriumManage/AddAuditorium";
import UserReservationHistoryPage from "./Components/UserReservationHistoryPage/UserReservationHistoryPage";
import ReservationsForScreeningPage from "./Components/ReservationsForScreeningPage/ReservationsForScreeningPage";
import TicketSelectionPageWorker from "./Components/TicketSelectionPageWorker/TicketSelectionPageWorker";


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
                    <PrivateRoute path="/home" component={<MainPage/>}>
                    </PrivateRoute>
                    <PrivateRoute path="/screening/:id" component={<TicketSelectionPage/>}>
                    </PrivateRoute>
                    <PrivateRoute path="/screeningWorker/:id" component={<TicketSelectionPageWorker/>}>
                    </PrivateRoute>
                    <PrivateRoute path="/movies" component={<MoviesManagePage/>}>
                    </PrivateRoute>
                    <PrivateRoute path="/addMovie" component={<AddMovie/>}>
                    </PrivateRoute>
                    <PrivateRoute path="/ticketTypes" component={<TicketTypesManagePage/>}>
                    </PrivateRoute>
                    <PrivateRoute path="/addTicketType" component={<AddTicketType/>}>
                    </PrivateRoute>
                    <PrivateRoute path="/addScreening" component={<AddScreening/>}>
                    </PrivateRoute>
                    <PrivateRoute path="/auditoriums" component={<AuditoriumsManagePage/>}>
                    </PrivateRoute>
                    <PrivateRoute path="/addAuditorium" component={<AddAuditorium/>}>
                    </PrivateRoute>
                    <PrivateRoute path="/myReservationsHistory" component={<UserReservationHistoryPage/>}>
                    </PrivateRoute>
                    <PrivateRoute path="/screeningInfo/:id" component={<ReservationsForScreeningPage/>}>
                    </PrivateRoute>
                </Switch>
                <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage}/>
            </div>
        </Router>
    );
}

export default App;
