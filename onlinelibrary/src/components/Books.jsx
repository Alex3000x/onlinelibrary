import { useState, useEffect } from "react";
import axios from "axios";
import Book from "./Book";
import { Row, Col, Container, Badge, Form } from "react-bootstrap";
import { Button } from "react-bootstrap";


function Books({searchTerm, searchCriteria, allBooks, onShowDetail, onUpdate, onDelete})
{
    console.log("BOOKS()");

    const [books, setBooks] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);
    // Cambiato il default da "title" a "default" per seguire l'ordine del DB all'avvio
    const [sortBy, setSortBy] = useState("default"); 
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 12; // Quanti libri vuoi per pagina

    useEffect(() => {

        async function fetchBooks()
        {
            try
            {
                setLoading(true);

                const response = await axios.get("http://localhost:3000/onlinelibrary/books?" + searchCriteria + "=" + searchTerm);


                console.log(response.data);

                setBooks(response.data);
                //setLoading(false);
            }
            catch(e)
            {
                console.log(e);
                //setLoading(false);
                setErr(e);
            }
            finally
            {
                setLoading(false);
            }
        }

        fetchBooks();

    }, [searchTerm, searchCriteria]); 

    const sortedBooks = [...books].sort((a, b) => {
        if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
        if (sortBy === "author") return (a.author || "").localeCompare(b.author || "");
        if (sortBy === "publicationYear") return b.publicationYear - a.publicationYear;
        // Se è "default", non applichiamo nessun ordinamento (mantiene l'ordine del DB)
        return 0;
    });

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(sortedBooks.length / booksPerPage);
    
    // Funzione per cambiare pagina e tornare su con lo scroll
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0); // Opzionale: torna in alto quando cambi pagina
    };

    const paginationColors = {
    primary: '#e190b6', // Il tuo rosa (puoi cambiarlo con un verdino tipo #A8E6CF)
    text: '#6c757d',    // Colore del testo "Pagina X di Y"
    activeNumber: '#e190b6' // Colore del numero pagina corrente
    };

    function onRefresh() {
        setRefresh(refresh + 1);
    }


    if(loading)
        return <p>Loading...</p>
    
    if(err)
        return <p>{err.message}</p>

    return (
    <Container>
            {/* BARRA DELLO STATO: Contatore e Ordinamento */}
            <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded shadow-sm">

                <div className="d-flex align-items-center gap-2">
                    <span className="text-muted fw-bold small">ORDINA PER:</span>
                    <Form.Select 
                        size="sm" 
                        style={{ width: '180px', borderRadius: '20px' }}
                        value={sortBy}
                        onChange={(e) => {
                            setSortBy(e.target.value);
                            setCurrentPage(1); // Torna alla pagina 1 quando cambi ordinamento
                        }}
                    >
                        <option value="default">In Evidenza (Default)</option>
                        <option value="title">Titolo</option>
                        <option value="author">Autore</option>
                        <option value="publicationYear">Anno (Recenti)</option>
                    </Form.Select>
                </div>

                <div>
                    <span className="fw-bold text-secondary">
                    Risultati trovati: <Badge bg="info">{sortedBooks.length}</Badge>
                    </span>

                </div>

            </div>


            
            <Row xs={1} md={2} lg={3} className="g-4"> 
                {currentBooks.map(b => (
                <Col key={b._id}>
                    <Book bookP={b} onShowDetail={onShowDetail} onUpdate={onUpdate} onDelete={onDelete}/>
                </Col>
                ))}
            </Row>

            {/* CONTROLLI PAGINAZIONE */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-3 mt-5 mb-5">
                    <Button 
                        variant="link"
                        disabled={currentPage === 1}
                        onClick={() => paginate(currentPage - 1)}
                        style={{ 
                            fontSize: '2rem', 
                            color: currentPage === 1 ? '#ccc' : paginationColors.primary,
                            textDecoration: 'none',
                            lineHeight: 1,
                            padding: 0
                        }}
                                >
                        &#8249; {/* Freccia sinistra sottile */}
                    </Button>

                    <div className="fw-bold" style={{ color: paginationColors.text, fontSize: '1.1rem' }}>
                        Pagina <span style={{ color: paginationColors.activeNumber, fontSize: '1.3rem' }}>{currentPage}</span> di {totalPages}
                    </div>

                    <Button 
                        variant="link"
                        disabled={currentPage === totalPages}
                        onClick={() => paginate(currentPage + 1)}
                        style={{ 
                            fontSize: '2rem', 
                            color: currentPage === totalPages ? '#ccc' : paginationColors.primary,
                            textDecoration: 'none',
                            lineHeight: 1,
                            padding: 0
                        }}  
                    >
                        &#8250; {/* Freccia destra sottile */}
                    </Button>
                </div>
            )}
        </Container>
        );
    }

export default Books;