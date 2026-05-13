import { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from "axios";

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
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const genres = ["Fantasy", "Romanzo classico", "Videogiochi", "Cultura orientale", "Arte", "Cucina", "Viaggi", "Storia", "Informatica", "Realismo magico", "Narrativa contemporanea", "Avventura", "Favola", "Psicologia", "Filosofia", "Horror / Sci-Fi", "Scienza", "Business", "Economia", "Poesia / Spiritualità"];
  const languages = ["Italiano", "Inglese", "Francese", "Tedesco", "Spagnolo", "Russo", "Giapponese", "Norvegese"];


  async function handleSubmit(e) {
    e.preventDefault();

    try {
      console.log("Dati pronti per il server:", formData);

      // Qui andrà la fetch POST verso il backend
      const response = await axios.post("http://localhost:3000/onlinelibrary/books",
          {
            ...formData,
            publicationYear: Number(formData.publicationYear),
            ISBN: Number(formData.isbn),
          }
        );
        
        setMessage(response.data.message);
        console.log(response.data);

        setFormData({
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
        });

    } catch (err) {
      console.error(err);

      if (err.response?.status === 409) {
        const error = err.response.data.error;

        setMessage(error);
      } else if (err.response?.status === 400) {
        const errors = err.response.data.errors;

        setMessage(errors.map(e => e.msg).join(", "));
      } else {
        const error = err.response.data.error;

        setMessage(error);
      }
    }
    onHide(); // Chiude il modal dopo l'invio
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
        <Modal.Title className="fw-bold text-info">✨🧚 Aggiungi Nuovo Libro</Modal.Title>
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
                <Form.Select 
                  name="genre" 
                  required 
                  value={formData.genre} 
                  onChange={handleChange}
                >             
                  <option value="" hidden>Seleziona genere...</option>
                  {genres.map(g => <option key={g} value={g}>{g}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Lingua</Form.Label>
                <Form.Select 
                  name="language" 
                  required 
                  value={formData.language} 
                  onChange={handleChange}
                >
                  <option value="" hidden disabled>Seleziona lingua...</option>
                  {languages.map(l => <option key={l} value={l}>{l}</option>)}
                </Form.Select>
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
            <Button variant="info" type="submit" onClick={handleSubmit} className="px-4 rounded-pill fw-bold text-white">
              Salva Libro
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddBookModal;
