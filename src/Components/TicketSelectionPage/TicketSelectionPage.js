import React, {useEffect, useRef, useState} from "react";
import axios, * as others from 'axios';
import {formatDate} from "../../Utility/Date";
import {Col, Container, Row} from "react-bootstrap";
import {Link, withRouter} from "react-router-dom";
import Button from "react-bootstrap/cjs/Button";
import Screening from "../ScreeningComponent/Screening";
import Seat from "./Seats";
import Select from 'react-select'
import TicketTypesTable from "./TicketTypesTable";


function TicketSelectionPage(props) {
    const [screeningData, setScreeningData] = useState({
        "screening": {},
        "auditorium": {}
    });
    const [bookedTickets, setBookedTickets] = useState([]);
    const [ticketTypes, setTicketTypes] = useState([])
    const [ticketTypesList, setTicketTypesList] = useState([]);
    const [numbers, setNumbers] = useState([]);
    const [rows, setRows] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedTicketTypes, setSelectedTicketTypes] = useState([]);
    const ticketTypeRef = useRef(null);
    const [numberAndTypesTicketsSelected, setNumberAndTypesTicketsSelected] = useState(false);
    const [ticketsToSelectNumber, setTicketsToSelectNumber] = useState(0);
    const [listTicketsRequestPost, setListTicketsRequestPost] = useState([]);
    useEffect(() => {
        const fetchTicketTypes = async () => {
            const result = await axios(
                process.env.REACT_APP_BACKEND_URL + `/ticketTypes`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}}
            );
            setTicketTypes(result.data);
            const quantities = [];
            result.data.forEach(item => {
                quantities.push({ticketTypeId: item.ticketTypeId, quantity: 0});
            })
            setSelectedTicketTypes(quantities);
            console.log(selectedTicketTypes);
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

    const onQuantityChange = (event, id) => {
        const index = selectedTicketTypes.findIndex(el => el.ticketTypeId === id);
        console.log(event.target.value);
        let newArray = [...selectedTicketTypes];
        newArray[index] = {...newArray[index], quantity: parseInt(event.target.value)};
        setSelectedTicketTypes(newArray);
    }

    const countTicketsToSelect = () => {
        let totalTicketsToSelect = selectedTicketTypes.reduce(function (accumulator, ticketType) {
            return accumulator + ticketType.quantity;
        }, 0);
        setTicketsToSelectNumber(totalTicketsToSelect);
    }

    const setStateTicketTypesList = () => {
        let list = [];
        let i = 0;
        selectedTicketTypes.forEach(selected => {
            if (selected.quantity > 0) {
                for (i = 0; i < selected.quantity; i++) {
                    list.push(selected.ticketTypeId);
                }
            }
        })
        setTicketTypesList(list);
    }

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
            setSelectedSeats(oldArray => [...oldArray, {'row': row, 'number': num}]);
            setBookedTickets(oldArray => [...oldArray, {'row': row, 'number': num, 'addedByUser': true}]);
            console.log(bookedTickets);
        } else {
            setSelectedSeats(selectedSeats.filter(selectedSeat => !(selectedSeat.row === row && selectedSeat.number === num)));
            setBookedTickets(bookedTickets.filter(bookedTicket => !(bookedTicket.row === row && bookedTicket.number === num)));
        }
    }

    const prepareRequestBody = () => {
        let list = [];
        let types = ticketTypesList;
        selectedSeats.forEach(seat => {
            list.push({
                auditoriumId: screeningData.auditorium.auditoriumId,
                seatRow: seat.row,
                seatNumber: seat.number,
                ticketTypeId: types[0]
            });
            types = types.slice(1);
        })
        return list;
    }

    const bookTicketRequest = () => {
        prepareRequestBody();
        console.log(listTicketsRequestPost);
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/tickets/${props.match.params.id}`, {
            ticketsList: prepareRequestBody()
        }, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}})
            .then((response) => {
                window.location.reload();
            }, (error) => {
            });
    }

    const setSelectingTypesDone = () => {
        countTicketsToSelect();
        setStateTicketTypesList();
        setNumberAndTypesTicketsSelected(true);
    }

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <div>
                {/*<select className="custom-select" ref={ticketTypeRef}>*/}
                {/*    {ticketTypes.map(ticketType =>*/}
                {/*        <option key={ticketType.ticketTypeId}*/}
                {/*                value={ticketType.ticketTypeId}>Bilet {ticketType.name}: {ticketType.price} zł</option>*/}
                {/*    )};*/}
                {/*</select>*/}
                <h3>Wybierz ilość i rodzaje biletów</h3>
                <TicketTypesTable onQuantityChange={onQuantityChange}/>
                {!numberAndTypesTicketsSelected &&
                <button onClick={setSelectingTypesDone} className="btn btn-primary">Zatwierdź wybór</button>
                }
                {numberAndTypesTicketsSelected &&
                <div>
                    <h3>Wybierz teraz miejsca - {ticketsToSelectNumber}</h3>
                    <div>
                        {rows.map((row, index) =>
                            <Seat num={numbers} ind={index} key={index} checkIfTaken={checkIfTaken}
                                  selectSeat={selectSeat}
                                  bookedTickets={bookedTickets}/>
                        )}
                    </div>
                    {selectedSeats.map((seat, index) => <p>
                        Wybrałeś miejsce: rząd {seat.row}, miejsce: {seat.number}
                    </p>)
                    }
                    <button onClick={bookTicketRequest} className="btn btn-primary m-2">Zarezerwuj bilety</button>
                </div>
                }
            </div>
        </div>
    );
}

export default withRouter(TicketSelectionPage);
