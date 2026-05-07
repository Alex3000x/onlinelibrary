import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

function AddBookModal({ show, onHide }) {
  // Stato iniziale con i nomi dei campi esatti del tuo DB
  const initialFormState = {
    title: '',
    author: '',
    publicationYear: '',
    genre: '',
    isbn: '',
    publisher: '',
    available: true,
    description: '',
    language: '',
    cover: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dati pronti per il server:", formData);
    // Qui andrà la fetch POST verso il backend
    // onHide(); // Chiude il modal dopo l'invio
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      centered 
      contentClassName="custom-modal-blur"
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold text-info">✨ Aggiungi Nuovo Libro</Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4">
        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Titolo e Autore */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Titolo</Form.Label>
                <Form.Control 
                  type="text" name="title" required
                  placeholder="Inserisci il titolo"
                  value={formData.title} onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Autore</Form.Label>
                <Form.Control 
                  type="text" name="author" required
                  placeholder="Nome dell'autore"
                  value={formData.author} onChange={handleChange}
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
                  type="number" name="publicationYear"
                  onInput={(e) => e.target.value = e.target.value.slice(0, 4)}
                  placeholder="Es: 2024"
                  value={formData.publicationYear} onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Genere</Form.Label>
                <Form.Control 
                  type="text" name="genre"
                  placeholder="Es: Fantasy, Sci-Fi"
                  value={formData.genre} onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
               <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Lingua</Form.Label>
                <Form.Control 
                  type="text" name="language"
                  placeholder="Es: Italiano"
                  value={formData.language} onChange={handleChange}
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
                  type="number" name="isbn"
                  onInput={(e) => e.target.value = e.target.value.slice(0, 13)}
                  placeholder="Codice di massimo 13 cifre"
                  value={formData.isbn} onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Editore</Form.Label>
                <Form.Control 
                  type="text" name="publisher"
                  placeholder="Nome casa editrice"
                  value={formData.publisher} onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Descrizione</Form.Label>
            <Form.Control 
              as="textarea" rows={3} name="description"
              placeholder="Breve trama del libro..."
              value={formData.description} onChange={handleChange}
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
            <Button variant="outline-secondary" onClick={onHide} className="px-4 rounded-pill">
              Annulla
            </Button>
            <Button variant="info" type="submit" className="px-4 rounded-pill fw-bold text-white">
              Salva Libro
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddBookModal;