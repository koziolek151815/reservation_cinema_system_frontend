import React from "react";
import {Button, Container, Row, Col} from "react-bootstrap";
import axios from "axios";
import Screening from "../ScreeningComponent/Screening";



class MainPage extends React.Component{
    state = {
        screenings: []
    }

    getScreenings() {
        axios.get(
            process.env.REACT_APP_BACKEND_URL + `/screenings`,{ headers: {"Authorization" : `Bearer ${this.token}`}}
        ).then((response)=>{
            console.log(response);
            this.setState({screenings: response.data})
        });

    }

    componentDidMount() {
        this.token = localStorage.getItem('token');
        this.getScreenings();
    }


    render() {
        return (
            <div>
                <Container className="my-1 pb-3">
                    <Row className="p-1">
                        <Col xs={12} md={12} className="p-1">
                            <h2>Screenings</h2>
                            {this.state.screenings.map(screening =>
                                <Screening screening = {screening} key={screening.screeningId} />
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
