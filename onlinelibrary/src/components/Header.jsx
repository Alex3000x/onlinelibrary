import { Container, Row, Col, Button } from 'react-bootstrap';

function Header({ onShowCatalog , onShowHome, onShowLogin}) {

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };


  return (
    <header className="bg-white" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
      
      {/* 1. BANNER ALTO (Full Width) */}
      <Container fluid className="px-4">
        <Row className="align-items-center g-0" style={{ minHeight: '120gipx'}}>
            {/* Colonna Logo: prende quasi tutto lo spazio (10 su 12) */}
          {/* Colonna LOGO: Prende 11 spazi su 12! */}
          <Col xs={10} md={11}> 
            <img 
              src="/IMG_1647.PNG" 
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
      <div className="navbar p-0 border-top border-bottom" style={{ backgroundColor: '#e190b6', borderColor: '#e190b6' }}>
           <Container fluid className="px-0"> 
          {/* flex-row e w-100 mantengono tutto sulla stessa linea senza collassare */}
            <div className="nav w-100 d-flex flex-row justify-content-around text-center">              {/* Le voci ora occupano spazio equo e sono "cicciotte" */}
              {['HOME', 'CATALOGO', 'SERVIZI', 'CONTATTACI', 'ORARI'].map((item) => (
                <a 
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

                  if (item === 'ORARI') scrollToSection('orari-section');
                  if (item === 'CONTATTACI') scrollToSection('contatti-section');

                }}
                
                href={item === 'CATALOGO' ? "#" : `#${item.toLowerCase()}`}
                  className="nav-link text-dark py-3"
                  style={{ 
                  fontWeight: '850', 
                  fontSize: 'clamp(0.6rem, 2.2vw, 1rem)', // Unica aggiunta per non farlo sparire
                  whiteSpace: 'nowrap',
                  flex: '1',
                  }}
                >
                  {item}
                </a>
              ))}
            </div>

        </Container>
      </div>
    </header>
  );
}

export default Header;