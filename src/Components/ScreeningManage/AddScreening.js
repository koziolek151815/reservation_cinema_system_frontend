import React, {useRef, useState} from "react";
import axios from "axios";
import {withRouter} from "react-router-dom";
import DatePicker from "react-datepicker";

import {registerLocale, setDefaultLocale} from "react-datepicker";
import pl from 'date-fns/locale/pl';
import {Button, Col} from "react-bootstrap";
import Screening from "../ScreeningComponent/Screening";
import ScreeningDayAuditorium from "./ScreeningDayAuditorium";
import {formatDate} from "../../Utility/Date";
import './AddScreeningStyles.css';
registerLocale('pl', pl)

class AddScreening extends React.Component {
    state = {
        auditoriums: [],
        startDate: new Date(),
        screenings: [],
        movies: [],
        endScreeningMovie: null,
        validDate: false
    }

    componentDidMount() {
        this.auditoriumRef = React.createRef();
        this.movieRef = React.createRef();
        this.startTimeRef = React.createRef();
        this.token = localStorage.getItem('token');
        this.getAuditoriums();
        this.getMovies();
    }

    getAuditoriums() {
        axios.get(
            process.env.REACT_APP_BACKEND_URL + `/auditoriums`, {headers: {"Authorization": `Bearer ${this.token}`}}
        ).then((response) => {
            this.setState({auditoriums: response.data})
        });
    }

    getMovies() {
        axios.get(
            process.env.REACT_APP_BACKEND_URL + `/movies`, {headers: {"Authorization": `Bearer ${this.token}`}}
        ).then((response) => {
            this.setState({movies: response.data})
        });
    }

    getScreenings() {
        console.log("Pobieram");
        if (!this.state.startDate) return;
        const parameterDate = this.state.startDate.toISOString().split('T')[0];
        axios.get(
            process.env.REACT_APP_BACKEND_URL + `/screenings/screeningDayAndAuditorium?date=${parameterDate}&auditoriumId=${this.auditoriumRef.current.value}`, {headers: {"Authorization": `Bearer ${this.token}`}}
        ).then((response) => {
            this.setState({screenings: response.data})
        });

    }

    addScreening = () => {
        const setStartScreening = this.state.startDate;
        const hours = this.startTimeRef.current.value.substring(0, 2);
        const minutes = this.startTimeRef.current.value.substring(3, 5);
        setStartScreening.setHours(hours);
        setStartScreening.setMinutes(minutes);
        const added = new Date(setStartScreening.getTime() + this.findMovieByMovieId().duration * 60000);
        this.setState({endScreeningMovie: added});
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/screenings`, {
            movieId: this.movieRef.current.value,
            auditoriumId: this.auditoriumRef.current.value,
            startScreening: setStartScreening,
            endScreening: added
        }, {headers: {"Authorization": `Bearer ${this.token}`}})
            .then((response) => {
                this.getScreenings();
            }, (error) => {
            });
    }
    changeEndScreening = (event) => {
        if (event.target.value.length === 5) {
            const setStartScreening = this.state.startDate;
            const hours = this.startTimeRef.current.value.substring(0, 2);
            const minutes = this.startTimeRef.current.value.substring(3, 5);
            setStartScreening.setHours(hours);
            setStartScreening.setMinutes(minutes);
            const added = new Date(setStartScreening.getTime() + this.findMovieByMovieId().duration * 60000);
            this.setState({endScreeningMovie: added});
            this.setState({validDate: true});
        }
    }
    findMovieByMovieId = () =>{
        let movieId = Number(this.movieRef.current.value);
        return this.state.movies.find(movie => movie.movieId === movieId);
    }

    render() {
        return (
            <div className="addScreening">
                <h3>Dodaj seans</h3>
                <p>Wybierz dzień i salę</p>
                <div className={"dayAndAuditorium"}>
                    <div className={"customPicker"}>
                <DatePicker locale="pl" calendarStartDay={1} selected={this.state.startDate}
                            disabledKeyboardNavigation dateFormat="dd/MM/yyyy"
                            onChange={(date) => this.setState({startDate: date})}/>
                    </div>
                <select className="custom-select" ref={this.auditoriumRef}>
                    {this.state.auditoriums.map(auditorium =>
                        <option key={auditorium.auditoriumId}
                                value={auditorium.auditoriumId}> {auditorium.name}</option>
                    )};
                </select>
                    <Button className="m-2" onClick={() => this.getScreenings()}>Wyszukaj seanse dla tego dnia i
                        sali</Button>
                </div>
                <div className={"addMovie"}>
                    <select className="custom-select" ref={this.movieRef}>
                        {this.state.movies.map(movie =>
                            <option key={movie.movieId} value={movie.movieId}> {movie.title}</option>
                        )};
                    </select>
                    <input id={"startTime"} ref={this.startTimeRef} onChange={this.changeEndScreening} type="text" name="name"
                           className="form-control" aria-describedby="emailHelp"
                           placeholder="Godzina rozpoczęcia"/>
                    <Button className="m-2" onClick={() => this.addScreening()}>Dodaj seans</Button>
                </div>
                {this.state.validDate && <p>Godzina zakończenia: {formatDate(this.state.endScreeningMovie)}</p>}

                {this.state.screenings.length !== 0 ? this.state.screenings.map(screening =>
                    <ScreeningDayAuditorium screening={screening} key={screening.screeningId}/>
                ) : `Brak seansów dla tego dnia i sali`}

            </div>
        );
    }
}

export default withRouter(AddScreening);
