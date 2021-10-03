import React, {useRef} from "react";
import axios from "axios";
import {withRouter} from "react-router-dom";
import {getToken} from "../../Utility/Authorization";


function AddAuditorium(props) {
    const nameInput = useRef(null);
    const rowsInput = useRef(null);
    const numbersInput = useRef(null);

    const addAuditoriumRequest = (event) => {
        event.preventDefault();
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/auditoriums`, {
            name: nameInput.current.value,
            rows: rowsInput.current.value,
            numbers: numbersInput.current.value,
        },{headers: {"Authorization": `Bearer ${getToken()}`}})
            .then((response) => {
                props.history.push('/auditoriums')
            }, (error) => {
            });
    }
    return (
        <div className="">
            <h4> Dodaj salę kinową</h4>
            <form>
                <div className="form-group">
                    <label>Nazwa sali</label>
                    <input ref={nameInput} type="text" name="name" className="form-control" aria-describedby="emailHelp"
                           placeholder="nazwa sali"/>
                    <label>Liczba rzędów</label>
                    <input ref={rowsInput} type="text" name="name" className="form-control" aria-describedby="emailHelp"
                           placeholder="rzędy"/>
                    <label>Miejsc w rzędzie</label>
                    <input ref={numbersInput} type="text" name="name" className="form-control" aria-describedby="emailHelp"
                           placeholder="miejsca"/>
                </div>
                <button onClick={addAuditoriumRequest} type="submit" className="btn btn-primary">Dodaj salę</button>
            </form>
        </div>
    );
}

export default withRouter(AddAuditorium);
