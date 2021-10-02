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
            `${process.env.REACT_APP_BACKEND_URL}${this.props.url}`
        );
    }
    fetchMovies = () => {
        this.getMoviesFromApi().then((response) => {
            this.setState({
                movies: response.data
            });
        })
    };

    deleteMovie = (id) => {
        axios.delete(
            `${process.env.REACT_APP_BACKEND_URL}/movies/${id}`
        );
        const filteredArray = this.state.movies.filter(movie => movie.movieId !== id)
        this.setState({movies: filteredArray});
    }

    render() {
        return (
            <div>
                {this.state.movies.map((movie, index) => (
                    <div>
                        <p>Tytuł: {movie.title}</p>
                        <MovieImage movieId={movie.movieId} key={movie.movieId}/>
                        <p>Opis: {movie.description}</p>
                        <a className="btn btn-default bg-info"
                           href={`/updateMovie/${movie.movieId}`}>Edytuj</a>
                        <button className="btn btn-default bg-danger"
                                onClick={() => this.deleteMovie(movie.movieId)}>Usuń z repertuaru
                        </button>
                    </div>
                ))}
            </div>
        );
    }
}

export default withRouter(MoviesList);
