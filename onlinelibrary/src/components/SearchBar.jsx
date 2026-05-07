import { Form, InputGroup, Button, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { propTypes } from 'react-bootstrap/esm/Image';

function SearchBar({ search, setSearch, criteria, setCriteria, setView, onShowAddModal  }) {
  

  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000')`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '80px 0', 
    color: 'white',
    textAlign: 'center',
    width: '100vw',    
    marginLeft: 'calc(-50vw + 50%)', 
    marginBottom: '40px'
  };

  return (
    <div style={backgroundStyle}>
      <Container>
        {/* Titolo (Font più cicciotto) */}
        <h2 style={{ fontWeight: '800', marginBottom: '30px', fontSize: '2.5rem' }}>
          Che libro stai cercando?
        </h2>

        <div className="mx-auto" style={{ maxWidth: '900px' }}>
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

            {/* Input di testo (Font più cicciotto) */}
            <Form.Control
              placeholder={`Cerca per ${criteria}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 shadow-none"
              style={{ fontSize: '1.2rem', fontWeight: '600' }}
            />

            {/* Bottone Lente  */}
            <Button 
              variant="success"
              onClick={() => setView("catalog") && setSearch(search)}
              style={{ backgroundColor: '#00c896', borderColor: '#00c896', width: '60px' }}
              >
              🔍
            </Button>

            {/* Bottone aggiungi libro */}
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
          </InputGroup>
        </div>
      </Container>
    </div>
  );
}

export default SearchBar;