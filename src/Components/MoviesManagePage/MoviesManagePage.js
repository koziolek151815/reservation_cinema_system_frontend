import React from "react";
import {withRouter} from "react-router-dom";
import MoviesList from "./MoviesList";

function MoviesManagePage() {
    const allMoviesUrl = "/movies"
    return (
        <div>
                <h2>Repertuar filmów</h2>
                <MoviesList url={allMoviesUrl}/>
                <a className="btn btn-default bg-success"
                   href={`/addMovie`}>Dodaj film do repertuaru</a>
        </div>
    );
}

export default withRouter(MoviesManagePage);
