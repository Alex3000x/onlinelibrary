import { Form, InputGroup, Button, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useState, useEffect } from 'react';

function SearchBar({ search, setSearch, criteria, setCriteria, setView, isAdmin, onShowAddModal }) {
  
  // Creiamo uno stato locale per l'input immediato (quello che l'utente vede mentre scrive)
  const [inputValue, setInputValue] = useState(search);

  // LOGICA DEBOUNCE: Sincronizziamo inputValue con lo stato globale 'search' dopo un delay
  useEffect(() => {
    // Se siamo in Home (view non è catalog), forse non vogliamo la ricerca istantanea
    // Ma se vuoi che funzioni ovunque, lasciamo il timer semplice:
  const timer = setTimeout(() => {
      setSearch(inputValue);
  }, 400); // 400 millisecondi di pausa prima di far partire la ricerca

    return () => clearTimeout(timer); // Puliamo il timer se l'utente preme un altro tasto
  }, [inputValue, setSearch]);

  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url("/IMG_1634.JPG")`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '80px 0', 
    color: 'white',
    textAlign: 'center',
    width: '100vw',    
    marginLeft: 'calc(-50vw + 50%)', 
    marginBottom: '10px',
    marginTop: '10px',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(inputValue);
    setSearch(search);
  }

  const translations = {
    all: "tutto",
    title: "titolo",
    author: "autore",
    publicationYear: "anno",
    genre: "genere",
    ISBN: "ISBN",
    publisher: "editore",
    language: "lingua"
  };

  const italianPlaceholder = translations[criteria] || "tutto";


  return (
    <div style={backgroundStyle}>
      <Container>
        {/* Titolo (Font più cicciotto) */}
        <h2 style={{ 
            fontWeight: '800', 
            marginBottom: '30px', 
            fontSize: '2.5rem', 
            color: '#1f1612',
            WebkitTextStroke: '#f8f2d0 1px', 
            
            // // Background e Bordi
            // backgroundColor: 'rgba(197, 202, 198, 0.5)', // Nero al 50% di opacità
            // borderRadius: '15px',                // Angoli arrotondati
            // padding: '10px 20px',                // Spazio interno (sopra/sotto e destra/sinistra)
            
            // // Layout
            // display: 'inline-block',             // Serve a far sì che il fondo segua la scritta e non occupi tutta la riga
            // marginBottom: '30px',
          }}>
          Che libro stai cercando?
        </h2>

        <div className="mx-auto" style={{ maxWidth: '900px' }}>
          <Form onSubmit={handleSubmit}>
            <InputGroup className="bg-white shadow-lg p-1" style={{ borderRadius: '5px' }}>
              
              {/* NUOVA SEZIONE: Tendina a sinistra */}
              <div className="d-flex align-items-center px-3 border-end">
                  <span className="text-dark me-2" style={{ fontWeight: '800' }}>Cerca per:</span>
                  <Form.Select 
                      value={criteria}
                      onChange={(e) => setCriteria(e.target.value)}
                      className="border-0 shadow-none p-0"
                      style={{ 
                          fontWeight: '700', 
                          fontSize: '1.1rem', 
                          width: '130px',
                          cursor: 'pointer' 
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

              <Form.Control
                placeholder={`Cerca per ${italianPlaceholder}...`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="border-0 shadow-none"
                style={{ fontSize: '1.2rem', fontWeight: '600' }}
              />

              {/* Bottone Lente  */}
              <Button 
                type="submit"
                variant="success"
                onClick={() => setView("catalog") && setSearch(search)}
                style={{ backgroundColor: '#E190B6', borderColor: '#E190B6', width: '60px' }}
                >
                🔍
              </Button>

              {/* Bottone aggiungi libro */}
              {/* Visualizza il tasto solo se l'utente è loggato come admin*/}
              {isAdmin && (
                <OverlayTrigger
                  placement="top"
                  // Se vuoi che appaia subito, togli la riga 'delay' qui sotto
                  delay={{ show: 250, hide: 400 }} 
                  overlay={(props) => (
                  <Tooltip id="add-tooltip" {...props}>
                    Aggiungi nuovo libro
                  </Tooltip>
                  )}
                  >
                  <Button 
                    variant="info"
                    className="ms-1"
                    style={{ 
                      backgroundColor: '#17a2b8', 
                      borderColor: '#17a2b8', 
                      width: '60px', 
                      fontWeight: '800', 
                      fontSize: '1.2rem', 
                      color: 'white' 
                    }}
                    onClick={onShowAddModal}
                    >
                    +
                  </Button>
                </OverlayTrigger>
              )}
            </InputGroup>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default SearchBar;