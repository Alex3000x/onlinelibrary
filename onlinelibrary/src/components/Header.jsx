import { Container, Row, Col, Button, Nav, Navbar } from 'react-bootstrap';

function Header({ onShowCatalog , onShowHome, onShowLogin}) {
  return (
    <header className="bg-white" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
      
      {/* 1. BANNER ALTO (Full Width) */}
      <Container fluid className="px-4">
        <Row className="align-items-center g-0" style={{ minHeight: '120px'}}>
            {/* Colonna Logo: prende quasi tutto lo spazio (10 su 12) */}
          {/* Colonna LOGO: Prende 11 spazi su 12! */}
          <Col xs={10} md={11}> 
            <img 
              src="/5771921865684226457.jpg" 
              alt="Online Library" 
              style={{ 
                width: '100%',      // Forza il logo a allargarsi su tutta la colonna
                height: 'auto', 
                maxHeight: '180px',  // Alza questo valore per farlo diventare "cicciotto"
                objectFit: 'contain',
                objectPosition: 'left' // Tiene il logo attaccato a sinistra
              }} 
            />
          </Col>

          {/* Destra: Bottone Login */}
          <Col xs={2} md={1} className="text-end">
            <Button 
              variant="outline-primary" 
              onClick = {onShowLogin}
              style={{ 
                borderRadius: '5px', 
                fontWeight: '800', 
                padding: '10px 30px',
                borderWidth: '2px',
                borderColor: '#e190b6',
                color: '#e190b6',
                textTransform: 'uppercase'
              }}
            >
              LOGIN
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