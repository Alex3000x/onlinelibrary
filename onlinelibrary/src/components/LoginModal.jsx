import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function LoginModal({ show, onHide, onSwitchToRegister }) {
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tentativo Login con:", loginData);
    // Qui andrà la fetch POST /login
  };

  return (
    <Modal show={show} onHide={onHide} centered contentClassName="custom-modal-blur">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold text-dark">Accedi alla Libreria</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Email</Form.Label>
            <Form.Control 
              type="email" name="email" placeholder="nome@esempio.it" required
              value={loginData.email} onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Password</Form.Label>
            <Form.Control 
              type="password" name="password" placeholder="********" required
              value={loginData.password} onChange={handleChange}
            />
          </Form.Group>
          <Button variant="info" type="submit" className="w-100 rounded-pill fw-bold text-white mb-3">
            Entra
          </Button>
          <div className="text-center">
            <span className="text-muted">Non sei ancora registrato? </span>
            <Button 
              variant="link" 
              className="p-0 text-info fw-bold text-decoration-none"
              onClick={onSwitchToRegister} // Chiude login e apre registrazione
            >
              Registrati
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;