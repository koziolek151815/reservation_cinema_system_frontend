import React from "react";
import axios from "axios";
import {Table} from "react-bootstrap";


class AuditoriumsList extends React.Component {
    state = {
        auditoriums: [],
        error: false
    };

    constructor(props) {
        super(props);
        this.token = localStorage.getItem('token');
        this.fetchAuditoriums();
    }

    getAuditoriumsFromApi = async () => {
        return await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/auditoriums`, {headers: {"Authorization": `Bearer ${this.token}`}}
        );
    }
    fetchAuditoriums = () => {
        this.getAuditoriumsFromApi().then((response) => {
            this.setState({
                auditoriums: response.data
            });
        })
    };


    render() {
        return (
            <div className="tickets">
                {this.state.auditoriums ?
                    (<Table striped bordered hover variant="dark">
                        <thead>
                        <tr>
                            <th>Indeks</th>
                            <th>Nazwa</th>
                            <th>Rzędy</th>
                            <th>Miejsc w rzędzie</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.auditoriums.map((auditorium, index) => (
                            <tr>
                                <td>{index + 1}</td>
                                <td>Sala {auditorium.auditoriumId}</td>
                                <td>{auditorium.rows}</td>
                                <td>{auditorium.numbers}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>)
                    : <h5> Brak sal kinowych</h5>}
            </div>
        );
    }
}

export default AuditoriumsList;
