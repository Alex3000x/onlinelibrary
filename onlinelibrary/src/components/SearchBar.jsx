import {
  Form,
  InputGroup,
  Button,
  Container,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useState, useEffect } from "react";

function SearchBar({
  search,
  setSearch,
  criteria,
  setCriteria,
  setView,
  isAdmin,
  onShowAddModal,
}) {
  // Creiamo uno stato locale per l'input immediato (quello che l'utente vede mentre scrive)
  const [inputValue, setInputValue] = useState(search);

  // LOGICA DEBOUNCE: Sincronizziamo inputValue con lo stato globale 'search' dopo un delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(inputValue);
    }, 400); // 400 millisecondi di pausa prima di far partire la ricerca

    return () => clearTimeout(timer); // Puliamo il timer se l'utente preme un altro tasto
  }, [inputValue, setSearch]);

  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url("/IMG_1634.JPG")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "clamp(35px, 7vw, 80px) 0", // Padding fluido: la banda diventa più bassa e meno invasiva su mobile
    color: "white",
    textAlign: "center",
    width: "100vw",
    marginLeft: "calc(-50vw + 50%)",
    marginBottom: "10px",
    marginTop: "10px",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(inputValue); // CORRETTO: Invia il valore attuale digitato, non il vecchio stato globale
  };

  const translations = {
    all: "tutto",
    title: "titolo",
    author: "autore",
    publicationYear: "anno",
    genre: "genere",
    ISBN: "ISBN",
    publisher: "editore",
    language: "lingua",
  };

  const italianPlaceholder = translations[criteria] || "tutto";

  return (
    <div style={backgroundStyle}>
      <Container className="px-3">
        {/* Titolo con font fluido clamp(): si ridimensiona automaticamente per non strabordare su mobile */}
        <h2
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: "clamp(1.4rem, 4.5vw, 2rem)",
            letterSpacing: "0.5px",
            background: "rgba(248,242,208, 0.6)",
            color: "#a74175",
            backdropFilter: "blur(4px)",
            padding: "6px 24px",
            borderRadius: "50px",
            display: "inline-block",
            marginBottom: "25px",
          }}
        >
          Che libro stai cercando?
        </h2>

        {/* Contenitore reattivo per limitare l'allungamento su schermi enormi */}
        <div className="mx-auto" style={{ maxWidth: "750px" }}>
          <Form onSubmit={handleSubmit}>
            {/* Struttura Flex intelligente: impilata in verticale su mobile, in riga da tablet/desktop in poi */}
            <div className="d-flex flex-column flex-sm-row gap-2 bg-transparent bg-sm-white shadow-lg p-1 rounded">
              {/* SEZIONE 1: Selettore Criteri (Tendina a sinistra) */}
              <div
                className="d-flex align-items-center justify-content-start ps-3 pe-0 py-sm-0 bg-white rounded border-sm-end"
                style={{ minWidth: "185px" }}
              >
                <span
                  className="text-dark me-2"
                  style={{
                    fontWeight: "700",
                    whiteSpace: "nowrap",
                    fontSize: "1rem",
                  }}
                >
                  Cerca per:
                </span>
                <Form.Select
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  className="border-0 shadow-none p-0 fw-bold bg-transparent text-end text-sm-start"
                  style={{
                    fontSize: "1rem",
                    cursor: "pointer",
                    outline: "none",
                    width: "155px", // Allunghiamo il blocco per dare aria alle voci lunghe
                    paddingRight: "25px",
                  }}
                >
                  <option value="all">Tutto</option>
                  <option value="title">Titolo</option>
                  <option value="author">Autore</option>
                  <option value="publicationYear">Anno</option>
                  <option value="genre">Genere</option>
                  <option value="ISBN">ISBN</option>
                  <option value="publisher">Editore</option>
                  <option value="language">Lingua</option>
                </Form.Select>
              </div>

              {/* SEZIONE 2: Input del testo e pulsanti di attivazione */}
              <InputGroup className="bg-white rounded overflow-hidden flex-grow-1">
                <Form.Control
                  placeholder={`Cerca per ${italianPlaceholder}...`}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="border-0 shadow-none py-2"
                  style={{ fontSize: "1.1rem", fontWeight: "600" }}
                />

                {/* Bottone Lente */}
                <Button
                  type="submit"
                  variant="success"
                  onClick={() => {
                    setView("catalog");
                    setSearch(inputValue); // CORRETTO: Forza la ricerca sincrona sul testo inserito
                  }}
                  style={{
                    backgroundColor: "#E190B6",
                    borderColor: "#E190B6",
                    width: "55px",
                  }}
                  className="d-flex align-items-center justify-content-center"
                >
                  🔍
                </Button>

                {/* Bottone aggiungi libro (Esclusivo Admin) */}
                {isAdmin && (
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={(props) => (
                      <Tooltip id="add-tooltip" {...props}>
                        Aggiungi nuovo libro
                      </Tooltip>
                    )}
                  >
                    <Button
                      variant="info"
                      style={{
                        backgroundColor: "#17a2b8",
                        borderColor: "#17a2b8",
                        width: "55px",
                        fontWeight: "800",
                        fontSize: "1.3rem",
                        color: "white",
                      }}
                      onClick={onShowAddModal}
                      className="border-0 d-flex align-items-center justify-content-center"
                    >
                      +
                    </Button>
                  </OverlayTrigger>
                )}
              </InputGroup>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default SearchBar;
