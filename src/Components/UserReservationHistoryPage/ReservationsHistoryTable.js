import React from "react";
import axios from "axios";
import {Table} from "react-bootstrap";
import {formatDate} from "../../Utility/Date";
import DeleteConfirmation from "../../Utility/DeleteConfirmation";


class ReservationsHistoryTable extends React.Component {
    state = {
        reservations: [],
        error: false,
        displayConfirmationModal: false,
        currentReservationModal: null
    };

    constructor(props) {
        super(props);
        this.fetchReservations();
        this.token = localStorage.getItem('token');
    }

    hideConfirmationModal = () =>{
        this.setState({
            displayConfirmationModal: false
        })
    }
    showDeleteModal = (reservationId) =>{
        this.setState({
            displayConfirmationModal: true,
            currentReservationModal: reservationId
        })
    }
    submitDelete = (reservationId) =>{
        this.setState({
            displayConfirmationModal: false
        })
        this.cancelReservation(reservationId);
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
    cancelReservation = (id) => {
        axios.delete(
            `${process.env.REACT_APP_BACKEND_URL}/reservations/${id}`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}}
        ).then((response) => {
            this.fetchReservations();
        }, (error) => {
            this.setState({
                error: true
            })

        });
    }


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
                            <th>Odwołanie</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.reservations.map((reservation, index) => (
                            <tr>
                                <td>{index + 1}</td>
                                <td>{reservation.movie}</td>
                                <td>{formatDate(reservation.screeningDate)}</td>
                                <td>{reservation.auditoriumName}</td>
                                <td>{reservation.tickets.map((ticket) => <p>Rząd {ticket.row},
                                    Miejsce {ticket.number}, {ticket.ticketTypeName}</p>)}</td>
                                <td>{reservation.price}</td>
                                <td>{reservation.paid === true ? "Tak" : "Nie"}</td>
                                <td>{reservation.paid === true ? "Odbyto" :
                                    <button className="btn btn-default bg-danger"
                                            onClick={() => this.showDeleteModal(reservation.reservationId)}>Odwołaj
                                    </button>}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>)
                    : <h5> No reservations</h5>}
                <DeleteConfirmation showModal={this.state.displayConfirmationModal} confirmModal={this.submitDelete} hideModal={this.hideConfirmationModal} id={this.state.currentReservationModal} title={"Odwołanie rezerwacji"} message={"Czy chcesz odwołać tę rezerwację?"}/>
            </div>
        );
    }
}

export default ReservationsHistoryTable;
