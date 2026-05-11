import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  const footerStyle = {
    backgroundColor: '#ffffff', // Colore bianco come richiesto
    color: '#333',
    padding: '60px 0',
    borderTop: '1px solid #eee',
    marginTop: '40px'
  };

  const titleStyle = {
    fontWeight: '800',
    marginBottom: '25px',
    fontSize: '1.5rem',
    color: '#e190b6' // Usiamo il teal per richiamare il tema
  };

  const listStyle = {
    listStyle: 'none',
    padding: 0,
    lineHeight: '2'
  };

  return (
    <footer style={footerStyle}>
      <Container>
        <Row>
          {/* 1. INFORMAZIONI BIBLIOTECA */}
          <Col md={4} className="mb-4">
            <h4 style={titleStyle}>La Biblioteca</h4>
            <ul style={listStyle}>
              <li><a href="#history" className="text-decoration-none text-muted">La nostra storia</a></li>
              <li><a href="#staff" className="text-decoration-none text-muted">Lo Staff</a></li>
              <li><a href="#volunteer" className="text-decoration-none text-muted">Diventa Volontario</a></li>
              <li><a href="#work" className="text-decoration-none text-muted">Lavora con noi</a></li>
              <li><a href="#newsletter" className="text-decoration-none text-muted">Iscriviti alla Newsletter</a></li>
            </ul>
          </Col>

          {/* 2. ORARI DI APERTURA */}
          <Col md={4} className="mb-4 border-start border-end">
            <h4 style={titleStyle} className="ps-md-4">Orari della Biblioteca</h4>
            <div className="ps-md-4">
              <div className="d-flex justify-content-between mb-2">
                <span>Lunedì:</span> <strong>09:00 - 18:00</strong>
              </div>
              <div className="d-flex justify-content-between mb-2 border-top pt-2">
                <span>Martedì:</span> <strong>12:00 - 20:00</strong>
              </div>
              <div className="d-flex justify-content-between mb-2 border-top pt-2">
                <span>Mercoledì:</span> <strong>12:00 - 20:00</strong>
              </div>
              <div className="d-flex justify-content-between mb-2 border-top pt-2">
                <span>Giovedì:</span> <strong>09:00 - 18:00</strong>
              </div>
              <div className="d-flex justify-content-between mb-2 border-top pt-2">
                <span>Venerdì:</span> <strong>09:00 - 18:00</strong>
              </div>
              <div className="d-flex justify-content-between mb-2 border-top pt-2">
                <span>Sabato:</span> <strong>10:00 - 16:00</strong>
              </div>
              <div className="d-flex justify-content-between mb-2 border-top pt-2">
                <span>Domenica:</span> <strong className="text-danger">Chiuso</strong>
              </div>
            </div>
          </Col>

          {/* 3. CONTATTI E SEDE */}
          <Col md={4} className="mb-4 ps-md-5">
            <h4 style={titleStyle}>Contattaci</h4>
            <p className="mb-1"><strong>Telefono:</strong></p>
            <p className="text-primary fw-bold" style={{ fontSize: '1.2rem' }}>+39 0123 456 789</p>
            
            <h4 style={titleStyle} className="mt-4">Sede Legale</h4>
            <p className="text-muted">
              Piazza della Cultura, 42<br />
              00187 Roma (RM)<br />
              Italia
            </p>
          </Col>
        </Row>

        <Row className="mt-5 pt-4 border-top text-center text-muted">
          <Col>
            <p>&copy; 2026 Biblioteca Online. Tutti i diritti riservati.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;