import React from "react";
import axios from "axios";
import {Table} from "react-bootstrap";


class TicketTypesTable extends React.Component {
    state = {
        ticketTypes: [],
        error: false
    };

    constructor(props) {
        super(props);
        this.fetchTicketTypes();
    }

    getTicketTypesFromApi = async () => {
        return await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/ticketTypes`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}}
        );
    }
    fetchTicketTypes = () => {
        this.getTicketTypesFromApi().then((response) => {
            this.setState({
                ticketTypes: response.data
            });
        })
    };

    deleteTicketType = (id) => {
        axios.delete(
            `${process.env.REACT_APP_BACKEND_URL}/ticketTypes/${id}`,{headers: {"Authorization": `Bearer ${this.token}`}}
        ).then((response) => {
            const filteredArray = this.state.ticketTypes.filter(ticketType => ticketType.ticketTypeId !== id)
            this.setState({ticketTypes: filteredArray});
        }, (error) => {
            this.setState({
                error: true
            })

        });
    }
    onErrorSubmit = () => {
        this.setState({
            error: !this.state.error
        })
    }

    render() {
        return (
            <div className="tickets">
                {this.state.ticketTypes.length ?
                    (<Table striped bordered hover variant="dark">
                        <thead>
                        <tr>
                            <th>Indeks</th>
                            <th>Typ</th>
                            <th>Cena</th>
                            <th>Ilość</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.ticketTypes.map((ticketType, index) => (
                            <tr>
                                <td>{index + 1}</td>
                                <td>{ticketType.name}</td>
                                <td>{ticketType.price}</td>
                                <td>
                                    <input type="number" onChange={(event) =>this.props.onQuantityChange(event,ticketType.ticketTypeId)} name="name" min="0" className="form-control"
                                           placeholder="0"/>
                                </td>
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

export default TicketTypesTable;
