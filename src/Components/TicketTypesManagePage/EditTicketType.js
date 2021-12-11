import React, {useEffect, useRef} from "react";
import axios from "axios";
import {withRouter} from "react-router-dom";


function UpdateTicketType(props) {
    const nameInput = useRef(null);
    const priceInput = useRef(null);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/ticketTypes/${props.match.params.id}`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}})
            .then(response => {
                setInitialForm(response.data);
            });
    }, []);

    const setInitialForm = (ticketType) => {
        console.log(ticketType.price);
        nameInput.current.value = ticketType.name;
        priceInput.current.value = ticketType.price;
    }
    const updateTicketTypeRequest = (event) => {
        event.preventDefault();
        axios.put(`${process.env.REACT_APP_BACKEND_URL}/ticketTypes/${props.match.params.id}`, {
            name: nameInput.current.value,
            price: priceInput.current.value
        }, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}})
            .then((response) => {
                props.history.push('/ticketTypes')
            }, (error) => {
            });
    }
    return (
        <div className="">
            <h4> Edytuj typ biletu</h4>
            <form>
                <div className="form-group">
                    <label>Nazwa typu biletu</label>
                    <input ref={nameInput} type="text" name="name" className="form-control" aria-describedby="emailHelp"
                           placeholder="typ biletu" style={{width:"20%", margin: "0 auto"}}/>
                    <label>Cena [zł]</label>
                    <input ref={priceInput} type="text" name="name" className="form-control"
                           aria-describedby="emailHelp" style={{width:"20%", margin: "0 auto"}}
                           placeholder="cena"/>
                </div>
                <button onClick={updateTicketTypeRequest} type="submit" className="btn btn-primary">Zatwierdź</button>
            </form>
        </div>
    );
}

export default withRouter(UpdateTicketType);