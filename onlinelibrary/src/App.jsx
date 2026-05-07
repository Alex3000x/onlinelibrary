import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 
import Container from 'react-bootstrap/Container';
import Books from './components/Books';
import SearchBar from './components/SearchBar';
import Header from './components/Header';
import HomeContent from './components/HomeContent'; // Il tuo nuovo componente
import Footer from './components/Footer';
import BookDetailModal from './components/BookDetailModal';

function App() {
  console.log("APP()");
  const [search, setSearch] = useState("");
  const [criteria, setCriteria] = useState("all"); // "all" come criterio di default
  const [allBooks, setAllBooks] = useState([]);

  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Funzione per mostrare il catalogo (resettando la ricerca)
  const handleShowCatalog = () => {
    setSearch(""); // Pulisce eventuali filtri scritti dall'utente
    // Se usi uno stato per decidere se mostrare la Home o i Risultati, 
    // assicurati di impostarlo per mostrare i risultati.
  };

  // Funzione per aprire il modal passando un libro specifico
  const handleShowDetail = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  // Carichiamo i libri all'avvio per alimentare i caroselli della Home
  useEffect(() => {
    fetch("http://localhost:3000/onlinelibrary/books") // Assicurati che il percorso sia corretto
      .then((res) => res.json())
      .then((data) => setAllBooks(data))
      .catch((err) => console.error("Error loading books:", err));
  }, []);

  return (
    <>
      {/* Header e SearchBar ora sono liberi di occupare il 100% della larghezza */}
      <Header onShowCatalog={handleShowCatalog}/>
      
      <SearchBar 
        search={search} 
        setSearch={setSearch} 
        criteria={criteria} 
        setCriteria={setCriteria} 
      />
      

      {/* Visualizzazione condizionale */}
      {!search ? (
        // Se non sto cercando, mostro i caroselli (Staff Picks & New Arrivals)
        <HomeContent allBooks={allBooks} onShowDetail={handleShowDetail}/>
      ) : (
        // Se sto cercando, mostro la griglia filtrata dentro un Container per i margini
        <Container className="mt-5">
            <p className="text-secondary">
                Search term: <strong>{search}</strong> | Criteria: <strong>{criteria}</strong>
            </p>
            <hr />
            <Books  
              searchTerm={search} 
              searchCriteria={criteria} 
              allBooks={allBooks} // Passalo se serve al componente
              onShowDetail={handleShowDetail}
            />
        </Container>

        
      )}
      < Footer />

      {/* Il Modal rimane fuori dai condizionali così è sempre pronto ad aprirsi */}
      <BookDetailModal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        book={selectedBook} 
      />

    </>
      
      
  );
}

export default App;