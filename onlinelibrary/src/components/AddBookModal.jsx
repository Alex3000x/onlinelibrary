import { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from "axios";

function AddBookModal({ show, onHide, onRefresh }) {
  // Stato iniziale con i nomi dei campi esatti del tuo DB
  const initialFormState = {
    title: '',
    author: '',
    publicationYear: '',
    genre: '',
    ISBN: '',
    publisher: '',
    available: false,
    description: '',
    language: '',
    copiesNumber: 0,
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
    // Calcolo automatico della disponibilità in base alle copie
    const isAvailable = Number(formData.copiesNumber) > 0;
    
    try {
      console.log("Dati pronti per il server:", formData);

      // Qui andrà la fetch POST verso il backend
      const response = await axios.post("http://localhost:3000/topinibrary/books",
          {
            ...formData,
            publicationYear: Number(formData.publicationYear),
            // Impostiamo il numero di copie come numero
            copiesNumber: Number(formData.copiesNumber),
            available: isAvailable,
            // Il campo 'cover' viene costruito dinamicamente usando l'ISBN inserito, sfruttando l'API di Open Library per ottenere la copertina del libro
            // magari successivamente si potrebbe ottenere il link direttamente riferendosi al titolo e autore, dato che forse l'ISBN verrà reso non necessario compilarlo nel form
            cover: "https://covers.openlibrary.org/b/isbn/" + formData.ISBN + "-L.jpg",
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
          }
        );
        
        setMessage(response.data.message);
        console.log(response.data);

        // Reset del form allo stato iniziale
        setFormData(initialFormState);
        onRefresh(); // Aggiorna la lista dei libri dopo l'aggiunta
        onHide(); // Chiude il modal dopo l'invio

    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        setMessage(err.response.data.error);
      } else if (err.response?.status === 400) {
        const errors = err.response.data.errors;
        setMessage(errors.map(e => e.msg).join(", "));
      } else {
        setMessage(err.response?.data?.error || "Errore durante il salvataggio");
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
          
          {/* RIGA 1: Titolo - Autore - Editore */}
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small">Titolo</Form.Label>
                <Form.Control 
                  type="text" name="title" required
                  placeholder="Titolo libro"
                  value={formData.title} onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small">Autore</Form.Label>
                <Form.Control 
                  type="text" name="author" required
                  placeholder="Nome autore"
                  value={formData.author} onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small">Editore</Form.Label>
                <Form.Control 
                  type="text" name="publisher"
                  placeholder="Casa editrice"
                  value={formData.publisher} onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* RIGA 2: Anno - Genere - Lingua */}
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small">Anno Pubblicazione</Form.Label>
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
                <Form.Label className="fw-bold small">Genere</Form.Label>
                <Form.Select 
                  name="genre" required 
                  value={formData.genre} onChange={handleChange}
                >           
                  <option value="" hidden>Seleziona...</option>
                  {genres.map(g => <option key={g} value={g}>{g}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small">Lingua</Form.Label>
                <Form.Select 
                  name="language" required 
                  value={formData.language} onChange={handleChange}
                >
                  <option value="" hidden disabled>Seleziona...</option>
                  {languages.map(l => <option key={l} value={l}>{l}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* RIGA 3: ISBN e COPIE (Versione corta md=6) */}
          <Row>
            <Col md={6}>
              <Row>
                <Col xs={8}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Codice ISBN</Form.Label>
                    <Form.Control 
                      type="number" name="ISBN"
                      onInput={(e) => e.target.value = e.target.value.slice(0, 13)}
                      placeholder="Max 13 cifre"
                      value={formData.ISBN} onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col xs={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Copie</Form.Label>
                    <Form.Control 
                      type="number" name="copiesNumber" min="0"
                      value={formData.copiesNumber} onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* RIGA 4: Descrizione */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold small">Descrizione</Form.Label>
            <Form.Control 
              as="textarea" rows={3} name="description"
              placeholder="Breve trama del libro..."
              value={formData.description} onChange={handleChange}
              style={{ resize: 'none' }}
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