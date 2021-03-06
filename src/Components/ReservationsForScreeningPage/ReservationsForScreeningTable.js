import React from "react";
import axios from "axios";
import {Table} from "react-bootstrap";
import {formatDate} from "../../Utility/Date";
import DeleteConfirmation from "../../Utility/DeleteConfirmation";
import PayConfirmation from "../../Utility/PayConfirmation";
import Button from "react-bootstrap/cjs/Button";


class ReservationsForScreeningTable extends React.Component {
    state = {
        reservations: [],
        error: false,
        displayConfirmationModal: false,
        currentReservationModal: null,
        displayPayModal: false,
        screeningData:{
            "screening": {
                "movieResponseDto": {}
            },
            "auditorium": {}
        }
    };

    constructor(props) {
        super(props);
        this.fetchReservations();
        this.fetchScreeningData();
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
    hidePayModal = () =>{
        this.setState({
            displayPayModal: false
        })
    }
    showPayModal = (reservationId) =>{
        this.setState({
            displayPayModal: true,
            currentReservationModal: reservationId
        })
    }
    submitPay = (reservationId) =>{
        this.setState({
            displayPayModal: false
        })
        this.changeStatusOnPaid(reservationId);
    }
    getReservationsFromApi = async () => {
        return await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/reservations/${this.props.screeningId}`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}}
        );
    }
    fetchReservations = () => {
        this.getReservationsFromApi().then((response) => {
            this.setState({
                reservations: response.data
            });
        })
    };
    fetchScreeningData = async () => {
        const result = await axios(
            process.env.REACT_APP_BACKEND_URL + `/screenings/${this.props.screeningId}`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}}
        );
        this.setState({
            screeningData: result.data
        });

    };

    changeStatusOnPaid(reservationId) {
        axios.put(`${process.env.REACT_APP_BACKEND_URL}/reservations/${reservationId}`, {
        }, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}})
            .then((response) => {
                console.log(response);
                this.fetchReservations();
            }, (error) => {
                console.log(error);
            });
    }

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
                <h2>Rezerwacje na seans</h2>
                <h5>{this.state.screeningData.screening.movieResponseDto.title} {formatDate(this.state.screeningData.screening.startScreening)} Sala {this.state.screeningData.auditorium.auditoriumId}</h5>
                {this.state.reservations.length ?
                    (<Table striped bordered hover variant="dark">
                        <thead>
                        <tr>
                            <th>Indeks</th>
                            <th>U??ytkownik</th>
                            <th>Bilety</th>
                            <th>Cena [z??]</th>
                            <th>Op??acone</th>
                            <th>Odwo??anie</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.reservations.map((reservation, index) => (
                            <tr>
                                <td>{index + 1}</td>
                                <td>{reservation.userEmail}</td>
                                <td>{reservation.tickets.map((ticket) => <p>Rz??d {ticket.row},
                                    Miejsce {ticket.number}, {ticket.ticketTypeName}</p>)}</td>
                                <td>{reservation.price.toFixed(2)}</td>
                                <td>{reservation.paid === true ? "Tak" :
                                    <Button variant="success"
                                            onClick={() => this.showPayModal(reservation.reservationId)}>Op??a??
                                    </Button>}</td>
                                <td>{reservation.paid === true ? "Niemo??liwe" :
                                    <Button variant="danger"
                                            onClick={() => this.showDeleteModal(reservation.reservationId)}>Odwo??aj
                                    </Button>}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>)
                    : <h5> Brak rezerwacji</h5>}
                <DeleteConfirmation showModal={this.state.displayConfirmationModal} confirmModal={this.submitDelete} hideModal={this.hideConfirmationModal}
                                    id={this.state.currentReservationModal} title={"Odwo??anie rezerwacji"} message={"Czy chcesz odwo??a?? t?? rezerwacj???"}/>
                <PayConfirmation showModal={this.state.displayPayModal} confirmModal={this.submitPay} hideModal={this.hidePayModal}
                                    id={this.state.currentReservationModal} title={"Op??acenie rezerwacji"} message={"Czy chcesz oznaczy?? t?? rezerwacj?? jako op??acon???"}/>
            </div>
        );
    }


}

export default ReservationsForScreeningTable;
