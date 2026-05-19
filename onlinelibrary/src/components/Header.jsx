import { useState } from "react";
import { Container, Row, Col, Button, Dropdown, Badge } from "react-bootstrap";

function Header({
  onShowCatalog,
  onShowHome,
  onShowLogin,
  user,
  onLogout,
  onShowProfileModal,
  onShowSecurityModal,
  onShowAdminPanel,
  onShowFavouritesPanel,
}) {
  // Stato per controllare se il cursore è sopra il bottone di Login
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  // Stato per controllare se il cursore è sopra il bottone di Logout
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Stile comune per i bottoni per mantenerli identici
  const buttonStyle = {
    borderRadius: "5px",
    fontWeight: "800",
    padding: "10px 30px",
    borderWidth: "2px",
    borderColor: "#e190b6",
    color: "#e190b6",
    textTransform: "uppercase",
    whiteSpace: "nowrap", // Impedisce al testo di andare a capo
  };

  // Stile per l'avatar dell'utente
  const avatarStyle = {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #e190b6",
    cursor: "pointer",
  };

  // Stile personalizzato per resettare il blu attivo e aggiungere l'hover alle voci
  const dropdownItemStyle = {
    color: "#1f1612",
    transition: "background-color 0.15s ease",
    backgroundColor: "transparent",
  };

  // Questo elimina il blu attivo di Bootstrap e aggiunge un hover grigio chiaro nativo a tutte le voci
  if (typeof document !== "undefined") {
    const style = document.createElement("style");
    style.innerHTML = `
      .dropdown-item-custom:hover { background-color: #eff0f0 !important; color: #a74175 !important; }
      .dropdown-item-custom:active, .dropdown-item-custom.active { background-color: #eff0f0 !important; color: #a74175 !important; }
      .dropdown-item-custom-area:hover { background-color: #efb9b9 !important; color: #dc3545 !important; }

    `;
    document.head.appendChild(style);
  }

  return (
    <header
      className="bg-white"
      style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)" }}
    >
      {/* 1. BANNER ALTO (Full Width) */}
      <Container fluid className="px-3">
        <Row
          className="align-items-center gx-3 g-0-y"
          style={{ minHeight: "120px", width: "100%" }}
        >
          <Col xs={7} md={9}>
            <img
              src="/IMG_1672.PNG"
              alt="Topinibrary"
              onClick={onShowHome}
              style={{
                width: "100%", // Forza il logo a allargarsi su tutta la colonna
                height: "auto",
                maxHeight: "145px", // Alza questo valore per farlo diventare "cicciotto"
                objectFit: "contain",
                objectPosition: "left", // Tiene il logo attaccato a sinistra
                cursor: "pointer",
              }}
            />
          </Col>

          {/* SEZIONE LOGIN / LOGGATO */}
          <Col
            xs={5}
            md={3}
            className="d-flex justify-content-end align-items-center"
            style={{ minWidth: 0 }}
          >
            {user ? (
              /* PANNELLO DI CONTROLLO UTENTE A COMPARSA */
              <Dropdown align="end" style={{ maxWidth: "100%", minWidth: 0 }}>
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-user-profile"
                  className="text-decoration-none d-flex text-dark align-items-center gap-2 p-0 shadow-none"
                  style={{ maxWidth: "100%", minWidth: 0 }}
                >
                  {/* Informazioni affianco all'icona (Benvenutə username) */}
                  <span className="d-none d-sm-inline text-muted me-1">
                    Benvenutə
                  </span>
                  <span
                    className="d-inline-block text-truncate fw-bold align-middle"
                    style={{
                      maxWidth: "80px",
                      flexShrink: 1,
                      minWidth: 0,
                    }}
                    title={user.username} // mostra tooltip completo al passaggio del mouse sopra
                  >
                    {user.username}
                  </span>
                  <img
                    src={
                      user.avatarUrl ||
                      "https://cdn-icons-png.flaticon.com/512/1144/1144760.png"
                    }
                    alt="Avatar"
                    style={{ ...avatarStyle, flexShrink: 0 }} // impedisce all'avatar di rimpicciolirsi se lo spazio stringe
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className=" p-3 border-0"
                  style={{ width: "270px", borderRadius: "12px" }}
                >
                  {/* INFORMAZIONI BASE */}
                  <div className="text-center mb-3 border-bottom pb-3">
                    <h6 className="mb-0 fw-bold" style={{ color: "#1f1612" }}>
                      {user.firstName} {user.lastName}
                      <small className="fw-normal text-muted">
                        {" "}
                        - @{user.username}{" "}
                      </small>
                    </h6>

                    {/* BADGE RUOLO */}
                    {user.isAdmin ? (
                      <Badge
                        bg="warning"
                        className="mt-3 px-1 py-1 rounded-pill"
                      >
                        👑 Utente Admin
                      </Badge>
                    ) : (
                      <Badge
                        bg="info"
                        className="mt-3 px-2 py-1 rounded-pill text-white"
                      >
                        👤 Utente Standard
                      </Badge>
                    )}
                  </div>

                  {/* DATA DI ISCRIZIONE (Mostrata e non modificabile - Punto 1) */}
                  {/* <div className="text-center mb-2 border-bottom pb-2">
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      Iscritto dal: {formatRegistrationDate(user.createdAt)}
                    </span>
                  </div> */}

                  {/* 1. PERSONALIZZAZIONE PROFILO */}
                  <Dropdown.Item
                    onClick={onShowProfileModal}
                    className="pt-0 py-2 rounded small text-dark dropdown-item-custom"
                    style={dropdownItemStyle}
                  >
                    👤 Personalizza profilo
                  </Dropdown.Item>

                  {/* 2. GESTIONE ACCOUNT & SICUREZZA */}
                  <Dropdown.Item
                    onClick={onShowSecurityModal}
                    className="py-2 rounded small text-dark dropdown-item-custom"
                    style={dropdownItemStyle}
                  >
                    🔒 Gestione account & Sicurezza
                  </Dropdown.Item>

                  {/* 3. I MIEI PREFERITI */}
                  <Dropdown.Item
                    onClick={onShowFavouritesPanel}
                    className="py-2 rounded small text-muted dropdown-item-custom"
                    style={{ ...dropdownItemStyle, color: "#6c757d" }}
                  >
                    ❤️ I Miei Preferiti (coming soon)
                  </Dropdown.Item>

                  {/* 4. AREA RISERVATA (Esclusivo per gli Admin) */}
                  {user.isAdmin && (
                    <>
                      <Dropdown.Divider className="my-2" />
                      <Dropdown.Item
                        onClick={onShowAdminPanel}
                        className="py-1 rounded small text-danger fw-bold bg-light-danger text-center dropdown-item-custom-area"
                        style={{ transition: "background-color 0.15s ease" }}
                      >
                        🔑 AREA RISERVATA
                      </Dropdown.Item>
                    </>
                  )}

                  <Dropdown.Divider className="my-2 pb-2" />

                  {/* 5. TASTO LOGOUT (In fondo per facile arrivals) */}
                  <Dropdown.Item
                    as="button" // Forza l'elemento a comportarsi come un vero bottone, evitando i blocchi di stile di Bootstrap
                    onClick={onLogout}
                    onMouseEnter={() => setIsLogoutHovered(true)}
                    onMouseLeave={() => setIsLogoutHovered(false)}
                    className="w-100 py-2 fw-bold text-center btn"
                    style={{
                      borderRadius: "50rem", // Mantiene la forma a pillola coerente con il login
                      borderStyle: "solid",
                      borderWidth: "2px", // Spessore di 2px identico al Login per renderlo ben visibile
                      borderColor: "#dc3545", // Bordo rosso fisso che non sparisce mai!
                      backgroundColor: isLogoutHovered
                        ? "#dc3545"
                        : "transparent",
                      color: isLogoutHovered ? "#ffffff" : "#dc3545",
                      transition: "background-color 0.2s ease, color 0.2s ease",
                      cursor: "pointer",
                    }}
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button
                variant="none"
                onClick={onShowLogin}
                onMouseEnter={() => setIsLoginHovered(true)}
                onMouseLeave={() => setIsLoginHovered(false)}
                className="py-2 fw-bold text-center mt-2"
                style={{
                  ...buttonStyle,
                  borderRadius: "50rem", // Mantiene la forma a pillola (rounded-pill)
                  borderStyle: "solid",
                  borderColor: "#e190b6", // Forza il bordo a rimanere sempre rosa
                  backgroundColor: isLoginHovered ? "#e190b6" : "transparent",
                  color: isLoginHovered ? "#ffffff" : "#e190b6",
                  transition: "background-color 0.2s ease, color 0.2s ease",
                }}
              >
                Login
              </Button>
            )}
          </Col>
        </Row>
      </Container>

      {/* 2. NAVBAR (Full Width e perfettamente allineata) */}
      <div
        className="navbar p-0 border-top border-bottom"
        style={{ backgroundColor: "#e190b6", borderColor: "#e190b6" }}
      >
        <Container fluid className="px-0">
          {/* flex-row e w-100 mantengono tutto sulla stessa linea senza collassare */}
          <div className="nav w-100 d-flex flex-row justify-content-around text-center">
            {/* Le voci ora occupano spazio equo e sono "cicciotte" */}
            {["HOME", "CATALOGO", "ORARI", "CONTATTACI"].map((item) => (
              <a
                key={item}
                onClick={(e) => {
                  if (item === "CATALOGO") {
                    e.preventDefault(); // Impedisce il salto della pagina (#catalogo)
                    onShowCatalog(); // La funzione che hai passato come prop
                  }
                  if (item === "HOME") {
                    e.preventDefault();
                    onShowHome();
                  }

                  if (item === "CONTATTACI") {
                    e.preventDefault();
                    scrollToSection("contatti-section");
                  }

                  if (item === "ORARI") {
                    e.preventDefault();
                    scrollToSection("orari-section");
                  }
                }}
                href={item === "CATALOGO" ? "#" : `#${item.toLowerCase()}`}
                className="nav-link py-3"
                style={{
                  fontWeight: "850",
                  fontSize: "clamp(0.6rem, 2.2vw, 1rem)", // Unica aggiunta per non farlo sparire
                  whiteSpace: "nowrap",
                  flex: "1",
                  color: "#fffced",
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
