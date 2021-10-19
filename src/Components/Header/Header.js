import React, {useState, useEffect} from 'react';
import {Navbar, Nav, Button} from "react-bootstrap";
import {
    removeOnChangeLoginListener,
    addOnChangeLoginListener,
    isLoggedIn,
    logout,
    isAdmin
} from "../../Utility/Authorization";

class Header extends React.Component  {
    state = {
        loggedIn: isLoggedIn()
    }

    constructor(props) {
        super(props);

        this.updateLoggedInStatus = this.updateLoggedInStatus.bind(this);
    }

    updateLoggedInStatus(value)
    {
        this.setState({loggedIn: value})
    }

    componentDidMount() {
        addOnChangeLoginListener(this.updateLoggedInStatus)
    }

    componentWillUnmount() {
        removeOnChangeLoginListener(this.updateLoggedInStatus)
    }

    render()
    {
        return (
            <Navbar bg="dark" expand="lg" variant="dark">
                <Navbar.Brand href="home">Kino</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/home">Strona główna</Nav.Link>

                        {
                            isLoggedIn() && !isAdmin() ?
                                <Nav.Link href="/myReservationsHistory">Moje rezerwacje</Nav.Link> :
                                null

                        }
                        {
                            isLoggedIn() && isAdmin() ?
                                <Nav.Link href="/addMovie">Dodaj film</Nav.Link> :
                                null

                        }
                        {
                            isLoggedIn() && isAdmin() ?
                                <Nav.Link href="/addAuditorium">Dodaj salę kinową</Nav.Link> :
                                null

                        }
                    </Nav>

                    <Nav>
                        {
                            isLoggedIn() ?
                                <Button onClick={logout}>Wyloguj</Button> :
                                <Nav.Link href="/login">Zaloguj</Nav.Link>
                        }

                    </Nav>

                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default Header
