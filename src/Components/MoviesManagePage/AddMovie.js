import React from "react";
import axios from "axios";
import {withRouter} from "react-router-dom";
import './AddMovie.css';

class AddMovie extends React.Component {
    state = {
        title: '',
        tags: [],
        suggestions: [],
        description: '',
        director: '',
        selectedFile: null,
    };

    constructor(props) {
        super(props);

        this.fileInput = React.createRef();
        this.photoPreview = React.createRef();
        this.submitButtonRef = React.createRef();
        this.token = localStorage.getItem('token');

        this.maxTags = 10;
        this.minTitleLength = 4;
        this.minDescriptionLength = 5;
    }

    handleTitleChange = (event) => {
        this.setState(state => ({title: event.target.value}))
    };

    handleDescriptionChange = (event) => {
        this.setState(state => ({description: event.target.value}))
    };
    handleDirectorChange = (event) => {
        this.setState(state => ({director: event.target.value}))
    };

    sendMovieCreationRequest = () => {
        const formData = new FormData();
        formData.append("title", this.state.title);
        formData.append("director", this.state.director);
        formData.append("description", this.state.description);

        if (this.state.selectedFile != null) {
            formData.append("postPhoto", this.state.selectedFile);
        }
        let link = process.env.REACT_APP_BACKEND_URL + '/movies';

        this.submitButtonRef.current.disabled = true;

        axios.post(link, formData,
            {headers: {"Authorization": `Bearer ${this.token}`}})
            .then((response) => {
                    window.location.replace('/movies');
            })
            .catch((error) => {
                this.submitButtonRef.current.disabled = false;
                console.log(error);
                alert("File Upload Error");
            });
    };


    addMovie = (event) => {
        event.preventDefault();

        var error = false;

        if (this.state.title.length < this.minTitleLength) {
            this.props.showError('Title is too short!');
            error = true;
        } else if (this.state.description.length < this.minDescriptionLength) {
            this.props.showError('Description is too short!');
            error = true;
        }
        if (!error) {
            this.sendMovieCreationRequest();
        }
    };


    fileInputChangeHandler = (event) => {
        const [file] = this.fileInput.current.files

        if (file === null && file.length > 0) {
            return;
        }
        if (file[0] > process.env.REACT_APP_MAX_FILE_SIZE) {
            this.props.showError('File size is too big!');
            this.photoPreview.current.src = null;
            this.setState(state => ({selectedFile: null}))
            return;
        }
        this.setState(state => ({selectedFile: event.target.files[0]}))
        this.photoPreview.current.src = URL.createObjectURL(file)

    };

    render() {
        return (
            <div className="Post container my-2 border rounded" style={{background: "grey"}}>
                <div className="col-md-12 py-2 blogShort">
                    <h1>Dodaj nowy film do repertuaru</h1>

                    <form autocomplete="off">
                        <img style={{margin: "auto"}} ref={this.photoPreview} id="photoPreview" src="#" alt=""/>
                        <textarea id={"title"} value={this.title} placeholder={"Title"}
                                  onChange={this.handleTitleChange}/>
                        <textarea id={"director"} value={this.title} placeholder={"Director"}
                                  onChange={this.handleDirectorChange}/>
                        <textarea id={"description"} value={this.description} placeholder={"Write something"}
                                  onChange={this.handleDescriptionChange}/>

                        <span className="custom-file w-50 ">
                            <input className="custom-file-input" ref={this.fileInput} id="fileInput" accept="image/*"
                                   type="file" name="file"
                                   onChange={this.fileInputChangeHandler}/>
                            <label className="custom-file-label"
                                   htmlFor="customFile">{this.state.selectedFile !== null ? (this.state.selectedFile.name) : ("Choose file")}</label>
                        </span>

                        <button ref={this.submitButtonRef} className={"btn btn-default text-white bg-dark float-right"}
                                id="addPostButton" onClick={this.addMovie}>Dodaj film
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default AddMovie;
