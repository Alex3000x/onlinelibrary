import { useState, useEffect } from "react";
import axios from "axios";
import Book from "./Book";
import { Row, Col, Container, Badge, Form } from "react-bootstrap";


function Books({searchTerm, searchCriteria, allBooks, onShowDetail, onUpdate, onDelete})
{
    console.log("BOOKS()");

    const [books, setBooks] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);
    const [sortBy, setSortBy] = useState("title");

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
        return 0;
    });


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
                        style={{ width: '150px', borderRadius: '20px' }}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
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
                {sortedBooks.map(b => (
                <Col key={b._id}>
                    <Book bookP={b} onShowDetail={onShowDetail} onUpdate={onUpdate} onDelete={onDelete}/>
                </Col>
                ))}
            </Row>
        </Container>
        );
    }

export default Books;                