import React, {useState} from 'react';
import axios from 'axios';
import './RegistrationForm.css';
import { withRouter } from "react-router-dom";


function RegistrationForm(props) {

    const [state , setState] = useState({
        email : "",
        username : "",
        password : "",
        confirmPassword: "",
        successMessage: null
    })
    const handleChange = (e) => {
        const {id , value} = e.target
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }
    const sendDetailsToServer = () => {
        if(state.email.length && state.password.length && state.username.length) {

            props.showError(null);
            const payload={
                "email":state.email,
                "password":state.password,
                "username": state.username
            }
            axios.post(process.env.REACT_APP_BACKEND_URL + '/users/register', payload)
                .then(function (response) {
                    console.log(response);
                    if(response.status === 201){
                        setState(prevState => ({
                            ...prevState,
                            'successMessage' : 'Rejestracja przebiegła pomyślnie. Możesz się zalogować.'
                        }))
                        props.showError(null);
                    }

                    else if (response.status === 500){
                        console.log(response);
                        props.showError("Błąd podczas rejestracji.");
                    }
                    else{
                        console.log(response);
                        props.showError("Błąd podczas rejestracji");
                    }
                })
                .catch(function (error) {
                    console.log("Email taken");
                    props.showError("Email już zajęty");

                });
        } else {
            props.showError('Uzupełnij puste pola')
        }

    }
    const redirectToLogin = () => {
        props.history.push('/login');
    }
    const handleSubmitClick = (e) => {
        e.preventDefault();
        var error = false;
        if(!(state.password === state.confirmPassword)) {
            props.showError('Passwords do not match');
            error = true;
        }

        var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(!state.email.match(mailformat)){
            props.showError('Email is not valid');
            error = true;
        }
        if(!(state.password.length > 4)){
            props.showError('Password is too short');
            error = true;
        }
        if(!(state.username.length > 4)){
            props.showError('Username is too short');
            error = true;
        }
        if (!error){
            sendDetailsToServer()
        }
    }
    return(
        <div className="card mt-3 p-3" style={{width:"500px", marginLeft:"auto", marginRight:"auto", height:"auto"}}>
            <form>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">Adres email</label>
                    <input type="email"
                           className="form-control"
                           id="email"
                           aria-describedby="emailHelp"
                           placeholder="Enter email"
                           value={state.email}
                           onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputUsername1">Username</label>
                    <input className="form-control"
                           type="text"
                           id="username"
                           placeholder="Username"
                           value={state.username}
                           onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Hasło</label>
                    <input type="password"
                           className="form-control"
                           id="password"
                           placeholder="Wpisz hasło"
                           value={state.password}
                           onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Potwierdź hasło</label>
                    <input type="password"
                           className="form-control"
                           id="confirmPassword"
                           placeholder="Potwierdź hasło"
                           value={state.confirmPassword}
                           onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >
                    Zarejestruj się
                </button>
            </form>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <div className="mt-2">
                <span>Masz już konto? </span>
                <span className="loginText" onClick={() => redirectToLogin()}>Zaloguj się</span>
            </div>

        </div>
    )
}

export default withRouter(RegistrationForm);
