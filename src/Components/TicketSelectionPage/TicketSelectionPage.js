import React, {useEffect, useRef, useState} from "react";
import axios, * as others from 'axios';
import {formatDate} from "../../Utility/Date";
import {Col} from "react-bootstrap";
import {Link, withRouter} from "react-router-dom";
import Button from "react-bootstrap/cjs/Button";
import Screening from "../ScreeningComponent/Screening";
import Seat from "./Seats";
import Select from 'react-select'


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
    const ticketTypeRef = useRef(null);
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
    const bookTicketRequest = () => {

        axios.post(`${process.env.REACT_APP_BACKEND_URL}/tickets/${props.match.params.id}`, {
            auditoriumId: screeningData.auditorium.auditoriumId,
            seatRow: selectedSeat.row,
            seatNumber:selectedSeat.number,
            ticketTypeId: ticketTypeRef.current.value
        }, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}})
            .then((response) => {
                window.location.reload();
            }, (error) => {
            });
    }

    return (
        <div className="m-auto">
            <h3>Wybierz swoje miejsce</h3>
            {rows.map((row, index) =>
                <Seat num={numbers} ind={index} key={index} checkIfTaken={checkIfTaken} selectSeat={selectSeat}
                      bookedTickets={bookedTickets}/>
            )}
            {selectedSeat.row ? <p>Wybrałeś miejsce: rząd {selectedSeat.row}, miejsce: {selectedSeat.number}</p> : null}
            <select className="custom-select" ref={ticketTypeRef}>
                {ticketTypes.map(ticketType =>
                    <option key={ticketType.ticketTypeId} value={ticketType.ticketTypeId}>Bilet {ticketType.name}: {ticketType.price} zł</option>
                )};
            </select>
            <button onClick={bookTicketRequest} className="btn btn-primary">Zarezerwuj bilet</button>
        </div>
    );
}

export default withRouter(TicketSelectionPage);
