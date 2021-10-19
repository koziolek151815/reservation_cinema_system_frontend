import React, {useEffect, useState} from "react";
import axios, * as others from 'axios';
import {formatDate, isInFuture} from "../../Utility/Date";
import {Col} from "react-bootstrap";
import {Link, withRouter} from "react-router-dom";
import Button from "react-bootstrap/cjs/Button";
import {isAdmin, isLoggedIn} from "../../Utility/Authorization";


function Screening(props) {
    const [image, setImage] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(
                process.env.REACT_APP_BACKEND_URL + `/movies/getPhoto?movieId=${props.screening.movie.movieId}`
            );
            setImage(result.data);
        };
        fetchData();
    }, []);
    if (!isAdmin() && !props.screening.screenings.some(screening => isInFuture(screening.startScreening))) return null;
    return (
        <div className="m-auto">
            <div className="m-auto mb-4">
                <p> {props.screening.movie.title}</p>
                {image && <img className="mb-3" alt="post img" src={"data:image/jpeg;base64," + image}/>}
                {props.screening.screenings.map(screening => (isInFuture(screening.startScreening) || isAdmin()) &&
                    <div className="d-flex m-auto align-items-center justify-content-center">
                        <p className="p-1"> {formatDate(screening.startScreening).slice(1).slice(-5)}</p>
                        {isInFuture(screening.startScreening) && isLoggedIn() && !isAdmin() &&<Button onClick={() => props.history.push(`/screening/${screening.screeningId}`)}>Zarezerwuj
                            bilet</Button>}
                        {isInFuture(screening.startScreening) && isLoggedIn() && isAdmin() &&<Button onClick={() => props.history.push(`/screeningWorker/${screening.screeningId}`)}>Zarezerwuj
                            bilet</Button>}
                        {isAdmin() &&
                        <Button onClick={() => props.history.push(`/screeningInfo/${screening.screeningId}`)}>Dane
                            dotyczące seansu</Button>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default withRouter(Screening);
