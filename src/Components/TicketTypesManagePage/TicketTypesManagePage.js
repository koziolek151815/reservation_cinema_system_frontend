import React from "react";
import {withRouter} from "react-router-dom";
import TicketTypesList from "./TicketTypesList";

function TicketTypesManagePage() {
    const allTicketTypesUrl = "ticketTypes"
    return (
        <div className="MainPage" style={{margin: "0 auto"}}>
            <h2>Rodzaje biletów</h2>
            <TicketTypesList url={allTicketTypesUrl}/>
            <a className="btn btn-default bg-success"
               href={`/addTicketType`}>Dodaj nowy rodzaj biletu</a>
        </div>
    );
}

export default withRouter(TicketTypesManagePage);
