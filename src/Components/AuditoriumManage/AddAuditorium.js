import React, {useRef} from "react";
import axios from "axios";
import {withRouter} from "react-router-dom";
import {getToken} from "../../Utility/Authorization";


function AddAuditorium(props) {
    const rowsInput = useRef(null);
    const numbersInput = useRef(null);

    const addAuditoriumRequest = (event) => {
        event.preventDefault();
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/auditoriums`, {
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
                    <label>Liczba rzędów</label>
                    <input ref={rowsInput} type="text" name="name" className="form-control" aria-describedby="emailHelp"
                           placeholder="rzędy" style={{width:"20%", margin: "0 auto"}}/>
                    <label>Miejsc w rzędzie</label>
                    <input ref={numbersInput} type="text" name="name" className="form-control" aria-describedby="emailHelp"
                           placeholder="miejsca" style={{width:"20%", margin: "0 auto"}}/>
                </div>
                <button onClick={addAuditoriumRequest} type="submit" className="btn btn-primary" style={{margin: "4px"}}>Dodaj salę</button>
            </form>
        </div>
    );
}

export default withRouter(AddAuditorium);
