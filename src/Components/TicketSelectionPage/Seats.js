import Button from "react-bootstrap/cjs/Button";
import React from "react";

function Seat(props) {
    return (
        <div className="d-flex p-2" style={{background:'silver'}}>
            {props.num.map((numb, i) => <div>
                {/*{props.checkIfTaken(props.bookedTickets,i+1,props.ind+1) && <Button>{props.ind+1} {i+1}</Button>}*/}
              <Button className="m-1" style={{ background: props.checkIfTaken(props.bookedTickets,i+1,props.ind+1) ? 'red' : 'green' }}>{props.ind+1} {i+1}</Button>
            </div>)}
        </div>
    );
}
export default Seat
