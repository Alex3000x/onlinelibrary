import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function ProfileModal({ show, onHide, user, onUpdateSuccess }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    username: '',
    avatarUrl: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        dateOfBirth: user.dateOfBirth || '',
        username: user.username || '',
        avatarUrl: user.avatarUrl || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Nota: Qui chiameremo la rotta PATCH/PUT che creeremo nel backend
      const response = await axios.put(`http://localhost:3000/topinibrary/users/${user.id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
      
      // Aggiorniamo il localStorage e lo stato di App.jsx
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      onUpdateSuccess(updatedUser);
      alert("Profilo aggiornato con successo!");
      onHide();
    } catch (err) {
      alert(err.response?.data?.error || "Errore durante l'aggiornamento");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold" style={{ color: '#e190b6' }}>👤 Personalizza Profilo</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        <div className="text-center mb-4">
            <img 
              src={formData.avatarUrl || "https://cdn-icons-png.flaticon.com/512/1144/1144760.png"} 
              alt="Preview" 
              className="rounded-circle border" 
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            <p className="small text-muted mt-2">Anteprima Avatar</p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Nome</Form.Label>
                <Form.Control name="firstName" value={formData.firstName} required onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Cognome</Form.Label>
                <Form.Control name="lastName" value={formData.lastName} required onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Username</Form.Label>
                <Form.Control name="username" value={formData.username} required onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={4}>
                <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Data di Nascita</Form.Label>
                    <Form.Control type="date" name="dateOfBirth" value={formData.dateOfBirth} required onChange={handleChange} />
                </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">URL Immagine Profilo</Form.Label>
                <Form.Control 
                name="avatarUrl" 
                placeholder="https://link-immagine.jpg" 
                value={formData.avatarUrl} 
                onChange={handleChange} 
                />
              </Form.Group>
            </Col>
            <Col md={4}>
                <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Data di Iscrizione</Form.Label>
                    <Form.Control  
                    disabled
                    style={{ cursor: 'not-allowed' }} 
                    className="text-muted"
                    value={user ? new Date(user.createdAt).toLocaleDateString() : ""} 
                    />
                </Form.Group>
            </Col>
          </Row>

          <Button type="submit" className="w-100 fw-bold border-0" style={{ backgroundColor: '#e190b6' }}>
            Salva Modifiche
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ProfileModal;