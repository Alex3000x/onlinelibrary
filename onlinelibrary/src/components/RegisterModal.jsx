import axios from 'axios';
import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

function RegisterModal({ show, onHide, onSwitchToLogin }) {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    username: '', // ATTENZIONE: avevi scritto 'usarname', ho messo 'username' (correggi se il db ha il typo)
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setShowPassword(false);
  }, [show]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Dati registrazione per il DB:", userData);
    // fetch POST /register
    try {
        const response = await axios.post("http://localhost:3000/onlinelibrary/register", userData);
        alert(response.data.message);
        onSwitchToLogin(); // Dopo la registrazione, portalo al login
    } catch (err) {
        console.error("Errore durante la registrazione:", err.response?.data?.error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered contentClassName="custom-modal-blur">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold text-info">Crea il tuo Account</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Nome</Form.Label>
                <Form.Control type="text" name="firstName" required value={userData.firstName} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Cognome</Form.Label>
                <Form.Control type="text" name="lastName" required value={userData.lastName} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Data di Nascita</Form.Label>
                <Form.Control type="date" name="dateOfBirth" required value={userData.dateOfBirth} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Username</Form.Label>
                <Form.Control type="text" name="username" required value={userData.username} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Email</Form.Label>
            <Form.Control type="email" name="email" required value={userData.email} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Password</Form.Label>
            <InputGroup>
              <Form.Control 
                type={showPassword ? "text" : "password"} 
                name="password" // Mantiene il legame fondamentale con il tuo handleChange
                required 
                placeholder="********"
                value={userData.password} 
                onChange={handleChange} 
              />
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ display: 'flex', alignItems: 'center', borderColor: '#ced4da' }}
              >
                {showPassword ? <BsEyeSlash size={18} /> : <BsEye size={18} />}
              </Button>
            </InputGroup>
          </Form.Group>
          
          <Button variant="info" type="submit" onClick={handleSubmit} className="w-100 rounded-pill fw-bold text-white mb-3">
            Conferma Registrazione
          </Button>
          <div className="text-center text-muted">
            Hai già un account? <Button variant="link" className="p-0 text-info fw-bold text-decoration-none" onClick={onSwitchToLogin}>Accedi</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default RegisterModal;