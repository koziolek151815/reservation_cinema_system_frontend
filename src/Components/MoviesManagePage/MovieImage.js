import React, {useEffect, useState} from "react";
import axios, * as others from 'axios';
import {formatDate} from "../../Utility/Date";
import {Col} from "react-bootstrap";
import {Link, withRouter} from "react-router-dom";
import Button from "react-bootstrap/cjs/Button";


function MovieImage(props) {
    const [image, setImage] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(
                process.env.REACT_APP_BACKEND_URL + `/movies/getPhoto?movieId=${props.movieId}`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}}
            );
            setImage(result.data);
        };
        fetchData();
    }, []);
    return (
        <div>
            {image && <img style={{maxWidth: "300px"}} className="mb-3" alt="post img" src={"data:image/jpeg;base64," + image}/>}
        </div>

    );
}

export default withRouter(MovieImage);
