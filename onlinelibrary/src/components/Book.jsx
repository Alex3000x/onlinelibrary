import { Card, Button, Row, Col, Badge } from 'react-bootstrap';

function Book({ bookP }) {
  // Funzione per tagliare la descrizione se troppo lunga
  const truncateDescription = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Verifichiamo la disponibilità (nel tuo DB il campo potrebbe chiamarsi 'available' o 'availability')
  // Se non esiste ancora nel DB, per ora usiamo una logica di esempio
  const isAvailable = bookP.availability !== false; 

  return (
    <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
      <Card.Body>
        <Row>
          {/* SINISTRA: Copertina del libro */}
          <Col xs={5}>
            <img 
              src={bookP.cover} 
              alt={bookP.title}
              className="img-fluid"
              style={{ 
                borderRadius: '10px', 
                objectFit: 'cover', 
                width: '100%', 
                height: '180px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            />
          </Col>

          {/* DESTRA: Titolo, Autore e Disponibilità */}
          <Col xs={7} className="d-flex flex-column justify-content-start">
            <h5 className="mb-1 fw-bold text-dark" style={{ fontSize: '1.2rem' }}>
              {bookP.title}
            </h5>
            <p className="text-secondary mb-2" style={{ fontSize: '0.9rem' }}>
              by <span className="fw-bold">{bookP.author}</span>
            </p>
            
            {/* Bottone Disponibilità (non cliccabile, serve come indicatore) */}
            <div>
              <Badge 
                pill 
                bg={isAvailable ? "success" : "danger"} 
                style={{ 
                  padding: '8px 15px', 
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}
              >
                {isAvailable ? "Disponibile" : "Esaurito"}
              </Badge>
            </div>
          </Col>
        </Row>

        {/* SOTTO: Descrizione troncata */}
        <Row className="mt-3">
          <Col>
            <p className="text-muted italic" style={{ fontSize: '0.9rem', minHeight: '50px' }}>
              "{truncateDescription(bookP.description, 100)}"
            </p>
          </Col>
        </Row>

        {/* BOTTONE DETTAGLI: In basso a destra */}
        <div className="d-flex justify-content-end mt-2">
          <Button 
            variant="outline-info" 
            size="sm"
            style={{ 
              borderRadius: '20px', 
              fontWeight: '700', 
              padding: '5px 20px',
              borderWidth: '2px'
            }}
          >
            Show More
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Book;