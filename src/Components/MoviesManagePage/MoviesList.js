import React from "react";
import axios from "axios";
import MovieImage from "./MovieImage";
import {withRouter} from "react-router-dom";

class MoviesList extends React.Component {
    state = {
        movies: []
    };

    constructor(props) {
        super(props);
        this.fetchMovies();
    }

    getMoviesFromApi = async () => {
        return await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}${this.props.url}`,
            {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}}
        );
    }
    fetchMovies = () => {
        this.getMoviesFromApi().then((response) => {
            this.setState({
                movies: response.data
            });
        })
    };
    render() {
        return (
            <div>
                {this.state.movies.map((movie, index) => (
                    <div>
                        <h5>{movie.title}</h5>
                        <MovieImage movieId={movie.movieId} key={movie.movieId}/>
                        <h6>Reżyseria: {movie.director}</h6>
                        <p>{movie.description}</p>
                    </div>
                ))}
            </div>
        );
    }
}

export default withRouter(MoviesList);
