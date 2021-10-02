import React from "react";
import {withRouter} from "react-router-dom";
import MoviesList from "./MoviesList";

function MoviesManagePage() {
    const allMoviesUrl = "/movies"
    return (
        <div style={{background: "antiquewhite"}}>
            <h2>Repertuar filmów</h2>
            <a className="btn btn-default bg-success"
               href={`/addMovie`}>Dodaj film do repertuaru</a>
            <MoviesList url={allMoviesUrl}/>
        </div>
    );
}

export default withRouter(MoviesManagePage);
