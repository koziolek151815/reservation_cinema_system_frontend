import React, {useEffect, useState} from "react";
import axios, * as others from 'axios';
import {formatDate} from "../../Utility/Date";
import {Col} from "react-bootstrap";
import {Link, withRouter} from "react-router-dom";
import Button from "react-bootstrap/cjs/Button";


function Screening(props) {
    const [image, setImage] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(
                process.env.REACT_APP_BACKEND_URL + `/movies/getPhoto?movieId=${props.screening.movie.movieId}`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}}
            );
            setImage(result.data);
        };
        fetchData();
    }, []);
    return (
        <div className="m-auto">
            <div className="m-auto">
                <p> {props.screening.movie.title}</p>
                {image &&<img alt="post img" src={"data:image/jpeg;base64,"+image}/>}
                {props.screening.screenings.map(screening =>
                    <div className="d-flex m-auto align-items-center justify-content-center">
                        <p> {formatDate(screening.startScreening).slice(1).slice(-5)}</p>
                        <Button onClick={() => props.history.push(`/screening/${screening.screeningId}`)}>Zarezerwuj
                            bilet</Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default withRouter(Screening);
