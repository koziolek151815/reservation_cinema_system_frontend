import React, {useEffect, useState} from "react";
import axios, * as others from 'axios';
import {formatDate} from "../../Utility/Date";
import {Col} from "react-bootstrap";


function Screening(props) {

    return (
        <div className="Screening">
            <div>
                <p> {props.screening.movie.title}</p>
                {props.screening.screenings.map(screening =>
                    <p> {formatDate(screening.startScreening)}</p>
                )}
                <button>
                    Zarezerwuj bilet
                </button>
            </div>
        </div>
    );
}

export default Screening;
