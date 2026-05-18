import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

function UpdateBookModal({ show, onHide, bookP, onUpdate, onRefresh }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publicationYear: '',
    genre: '',
    ISBN: '',
    publisher: '',
    description: '',
    language: '',
    copiesNumber: 0,
    cover: ''
  });

  const genres = ["Fantasy", "Romanzo classico", "Videogiochi", "Cultura orientale", "Arte", "Cucina", "Viaggi", "Storia", "Informatica", "Realismo magico", "Narrativa contemporanea", "Avventura", "Favola", "Psicologia", "Filosofia", "Horror / Sci-Fi", "Scienza", "Business", "Economia", "Poesia / Spiritualità"];
  const languages = ["Italiano", "Inglese", "Francese", "Tedesco", "Spagnolo", "Russo", "Giapponese", "Norvegese"];

  useEffect(() => {
    if (bookP) {
      setFormData({
        title: bookP.title || '',
        author: bookP.author || '',
        publicationYear: bookP.publicationYear || '',
        genre: bookP.genre || '',
        ISBN: bookP.ISBN || '',
        publisher: bookP.publisher || '',
        description: bookP.description || '',
        language: bookP.language || '',
        copiesNumber: bookP.copiesNumber || 0,
        cover: bookP.cover || '',
      });
    }
  }, [bookP]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const updatedData = {
      ...formData,
      copiesNumber: Number(formData.copiesNumber),
      available: Number(formData.copiesNumber) > 0,
      cover: "https://covers.openlibrary.org/b/isbn/" + formData.ISBN + "-L.jpg"
    };
    await onUpdate(bookP._id, updatedData); 
    onRefresh(); // Aggiorna la lista dei libri dopo l'aggiornamento
    onHide(); // Chiude il modal dopo l'invio
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered contentClassName="custom-modal-blur">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold text-warning">✏️ Modifica Libro</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        <Form onSubmit={handleSubmit}>
          
          {/* RIGA 1 & 2: Rimangono larghe e divise in 3 (occupano tutto il modal) */}
          <Row>
            <Col md={4}><Form.Group className="mb-3"><Form.Label className="fw-bold small">Titolo</Form.Label><Form.Control name="title" value={formData.title} onChange={handleChange} /></Form.Group></Col>
            <Col md={4}><Form.Group className="mb-3"><Form.Label className="fw-bold small">Autore</Form.Label><Form.Control name="author" value={formData.author} onChange={handleChange} /></Form.Group></Col>
            <Col md={4}><Form.Group className="mb-3"><Form.Label className="fw-bold small">Editore</Form.Label><Form.Control name="publisher" value={formData.publisher} onChange={handleChange} /></Form.Group></Col>
          </Row>

          <Row>
            <Col md={4}><Form.Group className="mb-3"><Form.Label className="fw-bold small">Anno Pubblicazione</Form.Label><Form.Control name="publicationYear" type="number" onInput={(e) => e.target.value = e.target.value.slice(0, 4)} value={formData.publicationYear} onChange={handleChange}/></Form.Group></Col>
            <Col md={4}><Form.Group className="mb-3"><Form.Label className="fw-bold small">Genere</Form.Label><Form.Select name="genre" value={formData.genre} onChange={handleChange}>{genres.map(g => <option key={g} value={g}>{g}</option>)}</Form.Select></Form.Group></Col>
            <Col md={4}><Form.Group className="mb-3"><Form.Label className="fw-bold small">Lingua</Form.Label><Form.Select name="language" value={formData.language} onChange={handleChange}>{languages.map(l => <option key={l} value={l}>{l}</option>)}</Form.Select></Form.Group></Col>
          </Row>

          {/* RIGA 3: ISBN e COPIE accorciati (md=8 totale invece di 12) */}
          <Row>
            <Col md={8}> 
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Codice ISBN</Form.Label>
                    <Form.Control name="ISBN" value={formData.ISBN} onChange={handleChange} onInput={(e) => e.target.value = e.target.value.slice(0, 13)} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Copie Disponibili</Form.Label>
                    <Form.Control type="number" name="copiesNumber" min="0" value={formData.copiesNumber} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            {/* Il restante spazio (md=4) rimane vuoto, "accorciando" visivamente i due campi sopra */}
          </Row>

          {/* RIGA 4: Descrizione (torna larga) */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold small">Descrizione</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} style={{ resize: 'none' }} />
          </Form.Group>
          
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="outline-secondary" onClick={onHide} className="px-4 rounded-pill">Annulla</Button>
            <Button variant="warning" type="submit" className="px-4 rounded-pill fw-bold text-white">Aggiorna</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UpdateBookModal;