import React from 'react'
import { Modal, Button } from "react-bootstrap";

const PayConfirmation = ({ showModal, hideModal, confirmModal, id, message, title}) => {
    return (
        <Modal show={showModal} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body><div className="alert alert-success">{message}</div></Modal.Body>
            <Modal.Footer>
                <Button variant="default" onClick={hideModal}>
                    Nie
                </Button>
                <Button variant="success" onClick={() => confirmModal(id) }>
                    Tak
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default PayConfirmation;