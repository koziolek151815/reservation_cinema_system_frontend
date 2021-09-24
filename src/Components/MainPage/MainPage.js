import React from "react";
import {Button, Container, Row, Col} from "react-bootstrap";
import axios from "axios";
import Screening from "../ScreeningComponent/Screening";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import pl from 'date-fns/locale/pl';
registerLocale('pl', pl)

class MainPage extends React.Component {
    state = {
        screenings: [],
        startDate: new Date()
    }

    componentDidMount() {
        this.token = localStorage.getItem('token');
        this.getScreenings();
    }

    getScreenings() {
        if (!this.state.startDate) return;
        const parameterDate = this.state.startDate.toISOString().split('T')[0];
        axios.get(
            process.env.REACT_APP_BACKEND_URL + `/screenings?date=${parameterDate}`, {headers: {"Authorization": `Bearer ${this.token}`}}
        ).then((response) => {
            this.setState({screenings: response.data})
        });
    }

    render() {
        return (
            <div>
                <Container className="my-1 pb-3">
                    <Row className="p-1">
                        <Col xs={12} md={12} className="p-1">
                            <DatePicker locale="pl" calendarStartDay={1} selected={this.state.startDate}
                                        onChange={(date) => this.setState({startDate: date})}/>
                            <Button className="m-2" onClick={() => this.getScreenings()}>Wyszukaj wybranego dnia</Button>
                            <h2>Seanse</h2>
                            {this.state.screenings.map(screening =>
                                <Screening screening={screening} key={screening.screeningId}/>
                            )}
                        </Col>
                    </Row>
                </Container>

                <span className="footer fixed-bottom w-auto bg-dark text-white align-text-middle"
                      style={{height: "40px", padding: "7px"}}>
                Copyright &copy; Piotr Kozioł
            </span>
            </div>
        );
    }
}

export default MainPage;
