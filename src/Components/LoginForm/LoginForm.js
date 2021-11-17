import React, {useState} from 'react';
import axios from 'axios';
import { withRouter } from "react-router-dom";
import {login} from "../../Utility/Authorization";


function LoginForm(props) {
    const [state , setState] = useState({
        email : "",
        password : "",
        successMessage: null
    })
    const handleChange = (e) => {
        const {id , value} = e.target
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        const payload={
            "email":state.email,
            "password":state.password,
        }
        axios.post(process.env.REACT_APP_BACKEND_URL + '/users/authenticate', payload)
            .then(function (response) {
                if(response.status === 200){
                    setState(prevState => ({
                        ...prevState,
                        'successMessage' : 'Login successful. Redirecting to home page..'
                    }))
                    login(response.data['token']);
                    window.location = "/home"
                    props.showError(null)
                }

            })
            .catch(function (error) {
                props.showError("Nieprawidłowe dane logowania");
                console.log(error);
            });
    }


    return(
        <div className="card mt-3 p-3" style={{width:"500px", marginLeft:"auto", marginRight:"auto", height:"auto"}}>
            <form>
                <div className="form-group text-left">
                    <label >Adres email</label>
                    <input type="email"
                           className="form-control"
                           id="email"
                           placeholder="Wprowadź email"
                           value={state.email}
                           onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label >Hasło</label>
                    <input type="password"
                           className="form-control"
                           id="password"
                           placeholder="Wprowadź hasło"
                           value={state.password}
                           onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >Zaloguj się</button>
            </form>
            <div className="registerMessage">
                <span>Nie masz konta? </span>
                <a className="loginText" href="/register">Zarejestruj się</a>
            </div>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>

        </div>
    )
}

export default withRouter(LoginForm);
