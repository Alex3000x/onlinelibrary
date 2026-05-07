import { Container, Row, Col, Button, Nav, Navbar } from 'react-bootstrap';

function Header({ onShowCatalog , onShowHome}) {
  return (
    <header className="bg-white" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
      
      {/* 1. BANNER ALTO (Full Width) */}
      <Container fluid className="px-4">
        <Row className="align-items-center" style={{ minHeight: '120px' }}>
          {/* Sinistra: Area Logo (metà banner) */}
          <Col xs={6}>
            <div style={{ 
              width: '100%', 
              maxWidth: '500px', // Limita la crescita del logo su schermi enormi
              height: '80px', 
              backgroundColor: '#f8f9fa', 
              border: '1px dashed #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '5px'
            }}>
              <span className="text-secondary" style={{ fontWeight: '800', fontSize: '1.2rem', letterSpacing: '1px' }}>
                LOGO BIBLIOTECA
              </span>
            </div>
          </Col>

          {/* Destra: Bottone Login */}
          <Col xs={6} className="text-end">
            <Button 
              variant="outline-primary" 
              style={{ 
                borderRadius: '5px', 
                fontWeight: '800', 
                padding: '10px 30px',
                borderWidth: '2px',
                borderColor: '#007bff',
                color: '#007bff',
                textTransform: 'uppercase'
              }}
            >
              Login
            </Button>
          </Col>
        </Row>
      </Container>

      {/* 2. NAVBAR (Full Width e perfettamente allineata) */}
      <Navbar bg="light" expand="lg" className="border-top border-bottom p-0" style={{ backgroundColor: '#fdfdfd' }}>
        <Container fluid className="px-0"> 
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="w-100 d-flex justify-content-around">
              {/* Le voci ora occupano spazio equo e sono "cicciotte" */}
              {['HOME', 'CATALOGO', 'SERVIZI', 'CONTATTACI', 'ORARI'].map((item) => (
                <Nav.Link 
                  key={item}
                  onClick={(e) => {
                  if (item === 'CATALOGO') {
                    e.preventDefault(); // Impedisce il salto della pagina (#catalogo)
                    onShowCatalog();    // La funzione che hai passato come prop
                  }
                  if (item === 'HOME') {
                    e.preventDefault();
                    onShowHome();
                  }
                }}
                href={item === 'CATALOGO' ? "#" : `#${item.toLowerCase()}`}
                  className="text-dark py-3" 
                  style={{ 
                    fontWeight: '850', 
                    fontSize: '1.1rem',
                    letterSpacing: '0.5px'
                  }}
                >
                  {item}
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;