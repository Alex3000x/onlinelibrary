import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  const footerWrapperStyle = {
    backgroundColor: "#e190b6", // Il rosa del bordo esterno
    padding: "40px 20px",
    marginTop: "10px",
    width: "100vw",
    marginLeft: "calc(-50vw + 50%)",
  };

  const cardStyle = {
    backgroundColor: "#fcfaf2",
    borderRadius: "20px",
    padding: "30px",
    height: "100%",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Centra i titoli
    textAlign: "center", // Centra il testo
  };

  const titleStyle = {
    fontWeight: "800",
    marginBottom: "20px",
    fontSize: "1.4rem",
    color: "#e190b6",
  };

  const listStyle = {
    listStyle: "none",
    padding: 0,
    lineHeight: "2",
    width: "100%",
  };

  return (
    <>
      <footer style={footerWrapperStyle}>
        <Container>
          <Row className="g-4">
            {" "}
            {/* g-4 aggiunge spazio tra le colonne */}
            <Col md={4}>
              <div
                style={{ ...cardStyle, padding: "10px", overflow: "hidden" }}
              >
                <img
                  src="/IMG_1658.PNG"
                  alt="Mascotte Topinibrary"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "370px", // Più alto per farlo bello grande nel footer
                    objectFit: "contain",
                  }}
                />
              </div>
            </Col>
            {/* 2. ORARI */}
            <Col md={4}>
              <div style={cardStyle}>
                <h4 id="orari-section" style={titleStyle}>
                  Orari della Biblioteca
                </h4>
                <div style={{ width: "100%", fontSize: "0.9rem" }}>
                  {[
                    { d: "Lunedì", h: "09:00 - 18:00" },
                    { d: "Martedì", h: "09:00 - 18:00" },
                    { d: "Mercoledì", h: "09:00 - 18:00" },
                    { d: "Giovedì", h: "09:00 - 18:00" },
                    { d: "Venerdì", h: "09:00 - 18:00" },
                    { d: "Sabato", h: "10:00 - 16:00" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between mb-2 border-bottom pb-1"
                    >
                      <span>{item.d}:</span> <strong>{item.h}</strong>
                    </div>
                  ))}
                  <div className="d-flex justify-content-between">
                    <span>Domenica:</span>{" "}
                    <strong className="text-danger">Chiuso</strong>
                  </div>
                </div>
              </div>
            </Col>
            {/* 3. CONTATTI */}
            <Col md={4}>
              <div style={cardStyle}>
                <h4 id="contatti-section" style={titleStyle}>
                  Contattaci
                </h4>
                <p className="mb-1 fw-bold">Telefono:</p>
                <p
                  className="text-primary fw-bold"
                  style={{ fontSize: "1.1rem" }}
                >
                  +39 0123 456 789
                </p>

                <h4 style={titleStyle} className="mt-4">
                  Sede Legale
                </h4>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  Piazza dei Topini, 19
                  <br />
                  20064 Gorgonzola (MI)
                  <br />
                  Italia
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* Copyright fuori dal blocco rosa per un look più pulito */}
      <div className="text-center py-3 text-muted small">
        &copy; 2026 Topinibrary. Tutti i diritti riservati ai Topini 🧀🐀.
      </div>
    </>
  );
}

export default Footer;
