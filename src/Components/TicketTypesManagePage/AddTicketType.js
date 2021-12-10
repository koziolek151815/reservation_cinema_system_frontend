import React, {useRef} from "react";
import axios from "axios";
import {withRouter} from "react-router-dom";
import "./AddTicketType.css"

function AddTicketType(props) {
    const nameInput = useRef(null);
    const priceInput = useRef(null);

    const addTicketTypeRequest = (event) => {
        event.preventDefault();
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/ticketTypes`, {
            name: nameInput.current.value,
            price: priceInput.current.value
        },{headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}})
            .then((response) => {
                props.history.push('/ticketTypes')
            }, (error) => {
            });
    }
    return (
        <div className="">
            <h4> Dodaj nowy typ biletu</h4>
            <form>
                <div className="form-group addTicketType">
                    <label>Typ biletu</label>
                    <input ref={nameInput} type="text" name="name" className="form-control" aria-describedby="emailHelp"
                           placeholder="typ biletu" id={"ticketType"}/>
                    <label>Cena [zł]</label>
                    <input ref={priceInput} type="text" name="name" className="form-control" aria-describedby="emailHelp"
                           placeholder="cena" id={"price"}/>
                </div>
                <button onClick={addTicketTypeRequest} type="submit" className="btn btn-primary submit">Dodaj</button>
            </form>
        </div>
    );
}

export default withRouter(AddTicketType);
