import React from "react";
import {withRouter} from "react-router-dom";
import ReservationsHistoryTable from "./ReservationsHistoryTable";

function UserReservationHistoryPage() {

    return (
        <div className="MainPage" style={{margin: "0 auto"}}>
            <h2>Historia rezerwacji</h2>
            <ReservationsHistoryTable/>
        </div>
    );
}

export default withRouter(UserReservationHistoryPage);
