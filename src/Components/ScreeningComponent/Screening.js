import React, {useEffect, useState} from "react";
import axios, * as others from 'axios';
import {formatDate} from "../../Utility/Date";
import {Col} from "react-bootstrap";
import {Link, withRouter} from "react-router-dom";
import Button from "react-bootstrap/cjs/Button";


function Screening(props) {
    const goToTicketSelection = (screeningId) => {
        window.location.replace(`/screening/${screeningId}`);
    }
    return (
        <div className="Screening">
            <div>
                <p> {props.screening.movie.title}</p>
                {props.screening.screenings.map(screening =>
                    <div>
                        <p> {formatDate(screening.startScreening)}</p>
                        {/*<a className="btn btn-default bg-success"*/}
                        {/*   href={`/screening/${screening.screeningId}`}>Zarezerwuj bilet</a>*/}
                        <Button onClick={()=> props.history.push(`/screening/${screening.screeningId}`)}>Zarezerwuj bilet</Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default withRouter(Screening);
