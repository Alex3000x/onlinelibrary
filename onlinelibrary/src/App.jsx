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
import AddBookModal from './components/AddBookModal';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import axios from 'axios';


function App() {
  console.log("APP()");
  const [search, setSearch] = useState("");
  const [criteria, setCriteria] = useState("all"); // "all" come criterio di default
  const [allBooks, setAllBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("home"); // "home" o "results"  
  const [message, setMessage] = useState('');

  // Funzione per mostrare il catalogo (resettando la ricerca)
  const handleShowCatalog = () => {
    setSearch("");// Pulisce eventuali filtri scritti dall'utente
    setView("catalog"); // Imposta la vista sul catalogo
  };

  const handleShowHome = () => {
    setSearch("");// Pulisce eventuali filtri scritti dall'utente
    setView("home"); // Imposta la vista sulla home
  };

  // Funzione per aprire il modal passando un libro specifico
  const handleShowDetail = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleDelete = async (bookId) => {
    try {
        console.log("Tentativo di eliminazione libro con ID:", bookId);

        // Chiamata DELETE coerente con la tua handleSubmit
        const response = await axios.delete(`http://localhost:3000/onlinelibrary/books/${bookId}`);

        setMessage(response.data.message);
        console.log(response.data);

        // Aggiorna lo stato per rimuovere il libro dalla UI istantaneamente
        setAllBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));

    } catch (err) {
        console.error(err);
        if (err.response?.status === 404) {
            setMessage(err.response.data.error);
        } else {
            setMessage(err.response.data.error || "Errore durante l'eliminazione");
        }
    }
  };

  const [showAddModal, setShowAddModal] = useState(false); // Per il modal di aggiunta libro  

  const [showLoginModal, setShowLoginModal] = useState(false); // Per il modal di login
  const [showRegisterModal, setShowRegisterModal] = useState(false); // Per il modal di registrazione 

  // Funzioni "Switch" per passare da uno all'altro
  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };
  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
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
      <Header onShowCatalog={handleShowCatalog} onShowHome={handleShowHome} onShowLogin={() => setShowLoginModal(true)} />
      
      <SearchBar 
        search={search} 
        setSearch={setSearch} 
        criteria={criteria} 
        setCriteria={setCriteria} 
        setView={setView}
        onShowAddModal={() => setShowAddModal(true)} // Passa la funzione per mostrare il modal di aggiuntaq
      />
      

      {/* Visualizzazione condizionale */}
      {view === "home" ? (
        <HomeContent 
          allBooks={allBooks} 
          onShowDetail={handleShowDetail} 
          onGoToCatalog={() => setView("catalog")} // Passalo al tasto "Vai al catalogo"
        />
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
              onDelete={handleDelete}
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

      <AddBookModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
      />  

      <LoginModal 
        show={showLoginModal} 
        onHide={() => setShowLoginModal(false)} 
        onSwitchToRegister={switchToRegister} 
      />

      <RegisterModal 
        show={showRegisterModal} 
        onHide={() => setShowRegisterModal(false)} 
        onSwitchToLogin={switchToLogin} 
      />

    </>
      
      
  );
}

export default App;