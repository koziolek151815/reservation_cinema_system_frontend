import React, {useEffect, useState} from "react";
import axios, * as others from 'axios';
import {formatDate} from "../../Utility/Date";
import {Col} from "react-bootstrap";
import {Link, withRouter} from "react-router-dom";
import Button from "react-bootstrap/cjs/Button";
import Screening from "../ScreeningComponent/Screening";
import Seat from "./Seats";


function TicketSelectionPage(props) {
    const [screeningData, setScreeningData] = useState({
        "screening": {},
        "auditorium": {}
    });
    const [bookedTickets, setBookedTickets] = useState([]);
    const [ticketTypes, setTicketTypes] = useState([])
    const [numbers, setNumbers] = useState([]);
    const [rows, setRows] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState({});
    useEffect(() => {
        const fetchTicketTypes = async () => {
            const result = await axios(
                process.env.REACT_APP_BACKEND_URL + `/ticketTypes`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}}
            );
            setTicketTypes(result.data);
            console.log(result.data);
        };
        const fetchBookedTickets = async () => {
            const result = await axios(
                process.env.REACT_APP_BACKEND_URL + `/tickets/${props.match.params.id}`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}}
            );
            setBookedTickets(result.data);
            console.log(result.data);
        };
        const fetchScreeningData = async () => {
            const result = await axios(
                process.env.REACT_APP_BACKEND_URL + `/screenings/${props.match.params.id}`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}}
            );
            setScreeningData(result.data);
            console.log(result.data);
            f(result.data.auditorium.numbers, result.data.auditorium.rows);
        };
        fetchTicketTypes();
        fetchBookedTickets();
        fetchScreeningData()
    }, []);


    function f(numbers, rows) {
        setNumbers(Array.from({length: numbers}, (_, i) => i + 1));
        setRows(Array.from({length: rows}, (_, i) => i + 1));
    }

    const checkIfTaken = (bookedTickets, num, row) => {
        return bookedTickets.some(bookedTicket => bookedTicket.row === row && bookedTicket.number === num);
    }

    const checkIfTakenEarlier = (bookedTickets, num, row) => {
        const ticket = bookedTickets.find(bookedTicket => bookedTicket.row === row && bookedTicket.number === num);
        if (ticket === undefined) return false;
        return !bookedTickets.find(bookedTicket => bookedTicket.row === row && bookedTicket.number === num).hasOwnProperty('addedByUser');
    }

    const selectSeat = (bookedTickets, num, row) => {
        if (checkIfTakenEarlier(bookedTickets, num, row)) return;
        if (!checkIfTaken(bookedTickets, num, row)) {
            setSelectedSeat({'row': row, 'number': num});
            setBookedTickets(oldArray => [...oldArray, {'row': row, 'number': num, 'addedByUser': true}]);
            console.log(bookedTickets);
        } else {
            setSelectedSeat({});
            setBookedTickets(bookedTickets.filter(bookedTicket => !(bookedTicket.row === row && bookedTicket.number === num)));
        }
    }

    return (
        <div className="m-auto">
            <h3>Wybierz swoje miejsce</h3>
            {rows.map((row, index) =>
                <Seat num={numbers} ind={index} key={index} checkIfTaken={checkIfTaken} selectSeat={selectSeat}
                      bookedTickets={bookedTickets}/>
            )}
            {selectedSeat.row ? `Wybrałeś miejsce: rząd ${selectedSeat.row}, miejsce: ${selectedSeat.number}` : null}
        </div>
    );
}

export default withRouter(TicketSelectionPage);
