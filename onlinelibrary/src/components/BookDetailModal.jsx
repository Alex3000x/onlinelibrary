import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';

function BookDetailModal({ show, onHide, book }) {
  if (!book) return null;

  // Simuliamo una funzione per l'eliminazione
  const handleDelete = () => {
    if(window.confirm(`Sei sicuro di voler eliminare "${book.title}"?`)) {
      console.log("Inviando richiesta DELETE per ID:", book.id);
      // Qui andrà la fetch(..., { method: 'DELETE' })
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      centered 
      contentClassName="custom-modal-blur" // Classe per il blur
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold text-info">Dettagli Libro</Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 pb-4">
        <Row>
          {/* Cover a sinistra */}
          <Col md={5} className="text-center mb-3 mb-md-0">
            <img 
              src={book.cover} 
              alt={book.title} 
              className="img-fluid rounded shadow" 
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
          </Col>

          {/* Informazioni a destra */}
          <Col md={7}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h2 className="fw-bold mb-0">{book.title}</h2>
                <h5 className="text-secondary">by {book.author}</h5>
              </div>
              <Badge pill bg={book.available !== false ? "success" : "danger"} className="p-2 px-3">
                {book.available !== false ? "DISPONIBILE" : "NON DISPONIBILE"}
              </Badge>
            </div>

            <div className="mt-4 p-3 bg-light rounded shadow-sm">
              <p className="mb-0 italic" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
                {book.description}
              </p>
            </div>

            <div className="mt-4 border-top pt-3">
              <Row className="text-muted">
                <Col xs={6}><strong>Anno Pubblicazione:</strong> {book.publicationYear}</Col>
                <Col xs={6}><strong>ISBN:</strong> {book.ISBN || "N/A"}</Col>
              </Row>
              <div className="mt-3">
                <Badge bg="info" className="me-2 p-2">{book.genre}</Badge>
                <Badge bg="secondary" className="p-2">{book.publisher}</Badge>
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default BookDetailModal;