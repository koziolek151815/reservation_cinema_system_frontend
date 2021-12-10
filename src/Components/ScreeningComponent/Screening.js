import React, {useEffect, useState} from "react";
import axios, * as others from 'axios';
import {formatDate, isInFuture} from "../../Utility/Date";
import {Col} from "react-bootstrap";
import {Link, withRouter} from "react-router-dom";
import Button from "react-bootstrap/cjs/Button";
import {isAdmin, isLoggedIn} from "../../Utility/Authorization";
import './Screening.css';
import {Card, CardActions, CardContent, CardMedia, Typography} from "@material-ui/core";

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
    if (!isAdmin() && !props.screening.screenings.some(screening => isInFuture(screening.startScreening))) return `Brak seansów na ten dzień`;
    return (
            <div className="m-auto mb-4">
                <Card style={{width:"300px", margin:"auto"}}>
                    <CardMedia
                        component="img"
                        image={"data:image/jpeg;base64," + image}
                    />
                    <CardContent >
                        <Typography gutterBottom variant="h5" component="div">
                            {props.screening.movie.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {props.screening.movie.description}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <div className="d-flex m-auto align-items-center justify-content-center flex-wrap ">
                        {props.screening.screenings.map(screening => (isInFuture(screening.startScreening) || isAdmin()) &&<div className=" flex-column mb-2 align-items-center justify-content-center">
                                {isInFuture(screening.startScreening) && isLoggedIn() && !isAdmin() &&<Button style={{marginRight: "3px"}} onClick={() => props.history.push(`/screening/${screening.screeningId}`)}>{formatDate(screening.startScreening).slice(1).slice(-5)}</Button>}
                                {isInFuture(screening.startScreening) && isLoggedIn() && isAdmin() &&<Button style={{marginRight: "3px"}} onClick={() => props.history.push(`/screeningWorker/${screening.screeningId}`)}>{formatDate(screening.startScreening).slice(1).slice(-5)}</Button>}
                                {isAdmin() &&
                                <Button  onClick={() => props.history.push(`/screeningInfo/${screening.screeningId}`)}>Dane
                                    o seansie</Button>}
                            </div>
                        )}
                        </div>
                    </CardActions>
                </Card>
            </div>

    );
}

export default withRouter(Screening);
