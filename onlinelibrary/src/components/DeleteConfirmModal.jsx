import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function DeleteConfirmModal({ show, onHide, onConfirm, bookTitle }) {
  return (
    <Modal show={show} onHide={onHide} centered size="sm">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">Conferma eliminazione</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        Sei sicuro di voler eliminare: <br/>
        <strong>{bookTitle}</strong>?
      </Modal.Body>
      <Modal.Footer className="border-0 d-flex justify-content-center">
        <Button variant="secondary" onClick={onHide}>Annulla</Button>
        <Button variant="danger" onClick={onConfirm}>Elimina</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default DeleteConfirmModal;