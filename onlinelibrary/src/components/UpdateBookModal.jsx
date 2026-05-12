import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

function UpdateBookModal({ show, onHide, bookP, onUpdate }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publicationYear: '',
    genre: '',
    ISBN: '',
    publisher: '',
    available: true,
    description: '',
    language: '',
    cover: ''
  });
  // Ogni volta che il 'book' passato come prop cambia (ovvero quando clicchi su Edit), 
  // carichiamo i suoi dati nel form
  useEffect(() => {
    if (bookP) {
      setFormData({
        title: bookP.title || '',
        author: bookP.author || '',
        publicationYear: bookP.publicationYear || '',
        genre: bookP.genre || '',
        ISBN: bookP.ISBN || '',
        publisher: bookP.publisher || '',
        available: bookP.available !== false,
        description: bookP.description || '',
        language: bookP.language || '',
        cover: bookP.cover || ''
      });
    }
  }, [bookP]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Richiama la funzione passata dal padre (App.js)
    // book._id è l'id del libro che stiamo modificando
    await onUpdate(bookP._id, formData); 
    
    onHide(); // Chiude il modal dopo l'operazione
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered contentClassName="custom-modal-blur">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold text-warning">✏️ Modifica Libro</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Titolo e Autore */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Titolo</Form.Label>
                <Form.Control 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                />
              </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Autore</Form.Label>
                <Form.Control 
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                />
                </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Anno (max 4 cifre) e Genere */}
            <Col md={4}>
            <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Anno di Pubblicazione</Form.Label>
                <Form.Control 
                  name="publicationYear"
                  onInput={(e) => e.target.value = e.target.value.slice(0, 4)}
                  value={formData.publicationYear}
                  onChange={handleChange}
                />
            </Form.Group>
            </Col>
            <Col md={4}>
            <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Genere</Form.Label>
                <Form.Control 
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                />
            </Form.Group>
            </Col>
            <Col md={4}>
                <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Lingua</Form.Label>
                <Form.Control 
                  name="language"
                  placeholder="Es: Italiano"
                  value={formData.language}
                  onChange={handleChange}
                />
            </Form.Group>
            </Col>
        </Row>

        <Row>
            {/* ISBN (max 13 cifre) e Editore */}
            <Col md={6}>
            <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Codice ISBN</Form.Label>
                <Form.Control 
                  name="isbn"
                  onInput={(e) => e.target.value = e.target.value.slice(0, 13)}
                  value={formData.isbn}
                  onChange={handleChange}
                />
            </Form.Group>
            </Col>
            <Col md={6}>
            <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Editore</Form.Label>
                <Form.Control 
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                />
            </Form.Group>
            </Col>
        </Row>

        <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Descrizione</Form.Label>
            <Form.Control 
              as="textarea" rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Check 
                type="switch"
                id="available-switch"
                label="Disponibile"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="fw-bold text-success"
            />
        </Form.Group>
          
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="outline-secondary" onClick={onHide} className="px-4 rounded-pill">Annulla</Button>
            <Button variant="warning" type="submit" onClick={onUpdate} className="px-4 rounded-pill fw-bold text-white">Aggiorna</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UpdateBookModal;