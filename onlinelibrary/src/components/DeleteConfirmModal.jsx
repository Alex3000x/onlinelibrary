import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function DeleteConfirmModal({ show, onHide, onConfirm, bookTitle }) {
  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold w-100 text-center ps-5 display-6">⚠️Attenzione⚠️</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center py-4">
        <div className="mb-2 text-secondary" style={{ fontSize: '1.1rem' }}>
          Sei sicuro di voler eliminare definitivamente:
        </div>
        <div className="fw-bold text-dark px-3" style={{ fontSize: '1.6rem', lineHeight: '1.2' }}>
          {bookTitle}
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 d-flex justify-content-center pb-4 gap-3">
        <Button variant="light" onClick={onHide} className="px-4 fw-bold border">
          Annulla
        </Button>
        <Button variant="danger" onClick={onConfirm} className="px-4 fw-bold shadow-sm">
          Elimina
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default DeleteConfirmModal;