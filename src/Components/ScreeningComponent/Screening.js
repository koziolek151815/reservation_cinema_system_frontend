import React, {useEffect, useState} from "react";
import axios, * as others from 'axios';
import {formatDate} from "../../Utility/Date";



function Screening(props) {

    return (
        <div className="Screening">
            <div>
                <p> {props.screening.movieResponseDto.title}</p>
                <br/>
                <p> {formatDate(props.screening.startScreening)}</p>
                <br/>
                <p> {formatDate(props.screening.endScreening)}</p>
                <br/>
                <button>
                    Book ticket for screening
                </button>
            </div>
        </div>
    );
}

export default Screening;
