import React from "react";
import axios from "axios";
import {Table} from "react-bootstrap";
import {formatDate} from "../../Utility/Date";


class ReservationsHistoryTable extends React.Component {
    state = {
        reservations: [],
        error: false
    };

    constructor(props) {
        super(props);
        this.fetchReservations();
        this.token = localStorage.getItem('token');
    }

    getReservationsFromApi = async () => {
        return await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/reservations`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}}
        );
    }
    fetchReservations = () => {
        this.getReservationsFromApi().then((response) => {
            this.setState({
                reservations: response.data
            });
        })
    };


    render() {
        return (
            <div className="tickets">
                {this.state.reservations.length ?
                    (<Table striped bordered hover variant="dark">
                        <thead>
                        <tr>
                            <th>Indeks</th>
                            <th>Film</th>
                            <th>Godzina seansu</th>
                            <th>Sala</th>
                            <th>Bilety</th>
                            <th>Cena</th>
                            <th>Opłacone</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.reservations.map((reservation, index) => (
                            <tr>
                                <td>{index + 1}</td>
                                <td>{reservation.movie}</td>
                                <td>{formatDate(reservation.screeningDate)}</td>
                                <td>{reservation.auditoriumName}</td>
                                <td>{reservation.tickets.map((ticket) => <p>Rząd {ticket.row}, Miejsce {ticket.number}, {ticket.ticketTypeName}</p>)}</td>
                                <td>{reservation.price}</td>
                                <td>{reservation.paid === true?"Tak":"Nie"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>)
                    : <h5> No ticket types</h5>}
                {this.state.error && <div className="error">
                    <h4 id="err">Aby usunac typ biletu najpierw usuń bilety ją zawierajace</h4>
                    <button id="errorButton" onClick={this.onErrorSubmit}>Ok</button>
                </div>}
            </div>
        );
    }
}

export default ReservationsHistoryTable;
