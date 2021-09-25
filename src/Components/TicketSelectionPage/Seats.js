import Button from "react-bootstrap/cjs/Button";
import React from "react";

function Seat(props) {
    return (
        <div className="d-flex">
            {props.num.map((numb, i) => <div>
                <Button className="m-1">{props.ind+1} {i+1}</Button>
            </div>)}
        </div>
    );
}
export default Seat
