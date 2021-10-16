import React from "react";
import {withRouter} from "react-router-dom";
import ReservationsForScreeningTable from "./ReservationsForScreeningTable";

function ReservationsForScreeningPage(props) {

    return (
        <div className="MainPage" style={{margin: "0 auto"}}>
            <h2>Rezerwacje na ten seans</h2>
            <ReservationsForScreeningTable screeningId={props.match.params.id}/>
        </div>
    );
}

export default withRouter(ReservationsForScreeningPage);
