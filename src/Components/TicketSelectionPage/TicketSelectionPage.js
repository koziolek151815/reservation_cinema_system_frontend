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
import {Snackbar} from "@material-ui/core";
import {Alert} from "@mui/material";
import MuiAlert from "@mui/material/Alert";


function TicketSelectionPage(props) {
    const [screeningData, setScreeningData] = useState({
        "screening": {
            "movieResponseDto": {}
        },
        "auditorium": {}
    });
    const [bookedTickets, setBookedTickets] = useState([]);
    const [ticketTypes, setTicketTypes] = useState([])
    const [ticketTypesList, setTicketTypesList] = useState([]);
    const [numbers, setNumbers] = useState([]);
    const [rows, setRows] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedTicketTypes, setSelectedTicketTypes] = useState([]);
    const [numberAndTypesTicketsSelected, setNumberAndTypesTicketsSelected] = useState(false);
    const [ticketsToSelectNumber, setTicketsToSelectNumber] = useState(0);
    const [listTicketsRequestPost, setListTicketsRequestPost] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0.00);
    const [open, setOpen] = React.useState(false);
    useEffect(() => {
        const fetchTicketTypes = async () => {
            const result = await axios(
                process.env.REACT_APP_BACKEND_URL + `/ticketTypes`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}}
            );
            setTicketTypes(result.data);
            const quantities = [];
            result.data.forEach(item => {
                quantities.push({ticketTypeId: item.ticketTypeId, quantity: 0, price: 0.0});
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
        const changedTicketTypePriceForOne = ticketTypes.find(el => el.ticketTypeId === id).price;
        console.log(changedTicketTypePriceForOne);
        let newArray = [...selectedTicketTypes];
        newArray[index] = {...newArray[index], quantity: parseInt(event.target.value),
            price: parseInt(event.target.value) * changedTicketTypePriceForOne};
        setSelectedTicketTypes(newArray);
        console.log(selectedTicketTypes);
    }

    const countTicketsToSelect = () => {
        let totalTicketsToSelect = selectedTicketTypes.reduce(function (accumulator, ticketType) {
            return accumulator + ticketType.quantity;
        }, 0);
        setTicketsToSelectNumber(totalTicketsToSelect);

        let price = selectedTicketTypes.reduce(function (accumulator, ticketType) {
            return accumulator + ticketType.price;
        }, 0);
        setTotalPrice(price);
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
        return !bookedTickets.find(bookedTicket => bookedTicket.row === row && bookedTicket.number === num)
            .hasOwnProperty('addedByUser');
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
        if (ticketsToSelectNumber !== selectedSeats.length){
            setOpen(true);
            return;
        }
        prepareRequestBody();
        console.log(listTicketsRequestPost);
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/tickets/${props.match.params.id}`, {
            ticketsList: prepareRequestBody(),
            price: totalPrice
        }, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}})
            .then((response) => {
                props.history.push("/myReservationsHistory");
            }, (error) => {
            });
    }

    const setSelectingTypesDone = () => {
        countTicketsToSelect();
        setStateTicketTypesList();
        setNumberAndTypesTicketsSelected(true);
    }

    const handleClose = (event, reason) => {
        setOpen(false);
    };
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    return (
        <div style={{display: 'flex', justifyContent: 'center', background: 'antiquewhite'}}>
            <div style={{background: 'antiquewhite'}}>
                <h2>{screeningData.screening.movieResponseDto.title} {formatDate(screeningData.screening.startScreening)} Sala {screeningData.auditorium.auditoriumId}</h2>
                <h5>Wybierz rodzaje biletów i miejsca </h5>
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
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                            Wybrałeś niepoprawną liczbę biletów
                        </Alert>
                    </Snackbar>
                </div>
                }
            </div>
        </div>
    );
}

export default withRouter(TicketSelectionPage);
