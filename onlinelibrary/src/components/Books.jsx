import { useState, useEffect } from "react";
import axios from "axios";
import Book from "./Book";
import { Row, Col, Container, Badge, Form, Spinner } from "react-bootstrap";
import { Button } from "react-bootstrap";


function Books({searchTerm, searchCriteria, onShowDetail, onUpdate, onDelete, isAdmin, refresh})
{
    console.log("BOOKS()");

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);
    // Cambiato il default da "title" a "default" per seguire l'ordine del DB all'avvio
    const [sortBy, setSortBy] = useState("default"); 
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 12; // Quanti libri vuoi per pagina

    // Reset della pagina a 1 ad ogni nuova ricerca o cambio criterio
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, searchCriteria]);

    useEffect(() => {

        async function fetchBooks()
        {
            try
            {
                setLoading(true);
                // Aggiungiamo un piccolo delay artificiale di 500ms per mostrare lo spinner (opzionale)
                await new Promise(resolve => setTimeout(resolve, 500));

                const response = await axios.get("http://localhost:3000/topinibrary/books?" + searchCriteria + "=" + searchTerm);


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

    }, [searchTerm, searchCriteria, refresh]); 

    const sortedBooks = [...books].sort((a, b) => {
        // Se è "default", non applichiamo nessun ordinamento (mantiene l'ordine del DB)
        if (sortBy === "newest_added") return (b._id || "").localeCompare(a._id || "");
        if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
        if (sortBy === "author") return (a.author || "").localeCompare(b.author || "");
        if (sortBy === "year_desc") return b.publicationYear - a.publicationYear;
        if (sortBy === "year_asc") return a.publicationYear - b.publicationYear;
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

    if(err)
        return <p>{err.message}</p>

    return (
    <Container className="position-relative">
            {/* SPINNER: Appare sopra la lista quando loading è true */}
            {loading && (
                <div className="d-flex justify-content-center align-items-center" 
                     style={{ position: 'absolute', top: '100px', left: 0, right: 0, zIndex: 10 }}>
                    <Spinner animation="border" variant="info" style={{ width: '3rem', height: '3rem' }} />
                </div>
            )}

        {/* AVVOLGIAMO TUTTO IN UN DIV CON OPACITÀ VARIABILE.
             Se loading è true, diventa trasparente al 50% ma NON sparisce.*/}
            <div style={{ 
                opacity: loading ? 0.5 : 1, 
                transition: 'opacity 0.3s ease-in-out', // Transizione dolce
                pointerEvents: loading ? 'none' : 'auto' // Impedisce click mentre carica
            }}>
     
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
                        <option value="default">In evidenza</option>
                        <option value="newest_added">Ultime aggiunte</option>
                        <option value="title">Titolo</option>
                        <option value="author">Autore</option>
                        <option value="year_desc">Più recenti</option>
                        <option value="year_asc">Meno recenti</option>
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
                    <Book bookP={b} onShowDetail={onShowDetail} onUpdate={onUpdate} onDelete={onDelete} isAdmin={isAdmin}/>
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
            </div>
        </Container>
        );
    }

export default Books;