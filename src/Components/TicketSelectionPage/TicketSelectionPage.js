import React, {useEffect, useState} from "react";
import axios, * as others from 'axios';
import {formatDate} from "../../Utility/Date";
import {Col} from "react-bootstrap";
import {Link, withRouter} from "react-router-dom";
import Button from "react-bootstrap/cjs/Button";


function TicketSelectionPage(props) {
    const [screeningData, setScreeningData] = useState({});
    const [bookedTickets, setBookedTickets] = useState([]);
    const [ticketTypes, setTicketTypes] = useState([])
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
        };
        fetchTicketTypes();
        fetchBookedTickets();
        fetchScreeningData()
    }, []);
    return (
        <div className="m-auto">
        </div>
    );
}

export default withRouter(TicketSelectionPage);
