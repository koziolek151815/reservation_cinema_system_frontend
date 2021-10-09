import React, {useEffect, useState} from "react";
import axios, * as others from 'axios';
import {formatDate} from "../../Utility/Date";
import {Col} from "react-bootstrap";
import {Link, withRouter} from "react-router-dom";
import Button from "react-bootstrap/cjs/Button";
import {isAdmin} from "../../Utility/Authorization";


function ScreeningDayAuditorium(props) {
    const [image, setImage] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(
                process.env.REACT_APP_BACKEND_URL + `/movies/getPhoto?movieId=${props.screening.movieResponseDto.movieId}`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}}
            );
            setImage(result.data);
        };
        fetchData();
    }, []);
    return (
        <div className="m-auto">
            <div className="m-auto mb-4">
                <p> {props.screening.movieResponseDto.title}</p>
                {image && <img className="mb-3" alt="post img" src={"data:image/jpeg;base64," + image}/>}
                <p className="p-1"> {formatDate(props.screening.startScreening).slice(1).slice(-5)} - {formatDate(props.screening.endScreening).slice(1).slice(-5)}</p>
                <Button onClick={() => props.history.push(`/screening/${props.screening.screeningId}`)}>Odwołaj</Button>
            </div>
        </div>
    );
}

export default withRouter(ScreeningDayAuditorium);
