import { Container, Row, Col, Button, Dropdown, Badge } from 'react-bootstrap';

const avatarStyle = {
  width: '45px',
  height: '45px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '2px solid #e190b6',
  cursor: 'pointer'
};

function Header({ onShowCatalog , onShowHome, onShowLogin, user, onLogout, onShowProfileModal, onShowSecurityModal, onShowAdminPanel }) {

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

    // Stile comune per i bottoni per mantenerli identici
  const buttonStyle = {
    borderRadius: '5px',
    fontWeight: '800',
    padding: '10px 30px',
    borderWidth: '2px',
    borderColor: '#e190b6',
    color: '#e190b6',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap' // Impedisce al testo di andare a capo
  };

  // Formattazione della data di iscrizione (Punto 1 degli appunti)
  // const formatRegistrationDate = (dateString) => {
  //   if (!dateString) return "N/A";
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
  // };

  return (
    <header className="bg-white" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
      
      {/* 1. BANNER ALTO (Full Width) */}
      <Container fluid className="px-3">
        <Row className="align-items-center g-0" style={{ minHeight: '120px'}}>
          <Col xs={8} md={9}> 
            <img 
              src="/IMG_1655.PNG" 
              alt="Topinibrary" 
              onClick={onShowHome}
              style={{ 
                width: '100%',      // Forza il logo a allargarsi su tutta la colonna
                height: 'auto', 
                maxHeight: '145px',  // Alza questo valore per farlo diventare "cicciotto"
                objectFit: 'contain',
                objectPosition: 'left', // Tiene il logo attaccato a sinistra
                cursor: 'pointer'
              }} 
            />
          </Col>

          {/* SEZIONE LOGIN / LOGGATO */}
          <Col xs={4} md={3} className="d-flex justify-content-end align-items-center">
            {user ? (
              /* PANNELLO DI CONTROLLO UTENTE A COMPARSA */
              <Dropdown align="end">
                <Dropdown.Toggle variant="link" id="dropdown-user-profile" className="text-decoration-none d-flex text-dark align-items-center gap-2 p-0 shadow-none">
                  {/* Informazioni affianco all'icona (Nome o Username) */}
                  Benvenutə
                  <span className="d-md-inline d-md-text-truncate fw-bold">
                    {user.username}
                  </span>
                  <img 
                    src={user.avatarUrl || "https://cdn-icons-png.flaticon.com/512/1144/1144760.png"} 
                    alt="Avatar" 
                    style={avatarStyle}
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu className=" p-3 border-0" style={{ width: '270px', borderRadius: '12px' }}>
                  
                  {/* INFORMAZIONI BASE */}
                  <div className="text-center mb-3 border-bottom pb-3">
                    <h6 className="mb-0 fw-bold" style={{ color: '#1f1612' }}>
                      {user.firstName} {user.lastName}
                      <small className="fw-normal text-muted"> - @{user.username} </small>
                    </h6>
                  
                    {/* BADGE RUOLO */}
                    {user.isAdmin ? (
                        <Badge bg="warning" className="mt-3 px-1 py-1 rounded-pill">👑 Utente Admin</Badge>
                      ) : (
                        <Badge bg="info" className="mt-3 px-2 py-1 rounded-pill text-white">👤 Utente Standard</Badge>
                      )}
                  </div>

                  {/* DATA DI ISCRIZIONE (Mostrata e non modificabile - Punto 1) */}
                  {/* <div className="text-center mb-2 border-bottom pb-2">
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      Iscritto dal: {formatRegistrationDate(user.createdAt)}
                    </span>
                  </div> */}
                  
                  {/* 1. PERSONALIZZAZIONE PROFILO */}
                  <Dropdown.Item onClick={onShowProfileModal} className="pt-0 py-2 rounded small">
                    ⚙️ Personalizza profilo
                  </Dropdown.Item>
                  
                  {/* 2. GESTIONE ACCOUNT & SICUREZZA */}
                  <Dropdown.Item onClick={onShowSecurityModal} className="py-2 rounded small">
                    🔒 Gestione account & Sicurezza
                  </Dropdown.Item>
                  
                  {/* 3. I MIEI PREFERITI (Collegamento vuoto temporaneo) */}
                  <Dropdown.Item className="py-2 rounded small text-muted">
                    ❤️ I Miei Preferiti (coming soon)
                  </Dropdown.Item>

                  {/* 4. AREA RISERVATA (Esclusivo per gli Admin) */}
                  {user.isAdmin && (
                    <>
                      <Dropdown.Divider className="my-2" />
                      {/* <div className="px-2 py-1 small text-uppercase text-muted fw-bold" style={{ fontSize: '0.65rem' }}>
                        Amministrazione
                      </div> */}
                      <Dropdown.Item onClick={onShowAdminPanel} className="py-1 rounded small text-danger fw-bold bg-light-danger text-center">
                        🔑 AREA RISERVATA
                      </Dropdown.Item>
                    </>
                  )}

                  <Dropdown.Divider className="my-2 pb-2" />
                  
                  {/* 5. TASTO LOGOUT (In fondo per facile arrivo) */}
                  <Dropdown.Item onClick={onLogout} className="py-2 pt-1 rounded small text-danger fw-bold text-center border border-danger-subtle rounded-pill">
                    Logout
                  </Dropdown.Item>

                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button 
                variant="outline-secondary" 
                style={buttonStyle}
                className="py-2 rounded fw-bold text-center border border-danger-subtle rounded-pill mt-2"
                    Logout
                onClick={onShowLogin}
              >
                Login
              </Button>
            )}
          </Col>
        </Row>
      </Container>

      {/* 2. NAVBAR (Full Width e perfettamente allineata) */}
      <div className="navbar p-0 border-top border-bottom" style={{ backgroundColor: '#e190b6', borderColor: '#e190b6' }}>
           <Container fluid className="px-0"> 
          {/* flex-row e w-100 mantengono tutto sulla stessa linea senza collassare */}
            <div className="nav w-100 d-flex flex-row justify-content-around text-center">         
              {/* Le voci ora occupano spazio equo e sono "cicciotte" */}     
              {['HOME', 'CATALOGO', 'ORARI', 'CONTATTACI'].map((item) => (
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
                  
                  if (item === 'CONTATTACI'){
                    e.preventDefault();
                    scrollToSection('contatti-section');
                  } 
                  
                  if (item === 'ORARI') {
                    e.preventDefault();
                    scrollToSection('orari-section');
                  }

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