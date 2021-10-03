import React from "react";
import {withRouter} from "react-router-dom";
import AuditoriumsList from "./AuditoriumsList";

function AuditoriumsManagePage() {
    const auditoriumsUrl = "auditoriums"
    return (
        <div className="MainPage" style={{margin: "0 auto"}}>
            <h2>Sale kinowe</h2>
            <a className="btn btn-default bg-success"
               href={`/addAuditorium`}>Dodaj nową salę kinową</a>
            <AuditoriumsList url={auditoriumsUrl}/>
        </div>
    );
}

export default withRouter(AuditoriumsManagePage);
