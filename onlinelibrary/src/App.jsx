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
import UpdateBookModal from './components/UpdateBookModal';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import axios from 'axios';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import ProfileModal from './components/ProfileModal';
import SecurityModal from './components/SecurityModal';
import AdminUsersModal from './components/AdminUsersModal';


function App() {
  console.log("APP()");
  const [search, setSearch] = useState("");
  const [criteria, setCriteria] = useState("all"); // "all" come criterio di default
  const [allBooks, setAllBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("home"); // "home" o "results"  
  const [message, setMessage] = useState('');
  const [bookToUpdate, setBookToUpdate] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Per il modal di conferma eliminazione
  const [bookToDelete, setBookToDelete] = useState(null); // Per tenere traccia del libro che vogliamo eliminare
  // Stato per tenere traccia dell'utente loggato
  const [currentUser, setCurrentUser] = useState(() => {
    // Al caricamento, controlla se c'è un utente nel localStorage
    const savedUser = localStorage.getItem("user");
    // Se esiste lo trasformo in oggetto, altrimenti null
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [refresh, setRefresh] = useState(0); // Stato per forzare il refresh dei libri dopo operazioni CRUD


  // Funzione per mostrare il catalogo (resettando la ricerca)
  const handleShowCatalog = () => {
    setSearch("");// Pulisce eventuali filtri scritti dall'utente
    setView("catalog"); // Imposta la vista sul catalogo
    window.scrollTo(0, 0); // Scrolla in alto per mostrare subito il catalogo
  };

  const handleShowHome = () => {
    setSearch("");// Pulisce eventuali filtri scritti dall'utente
    setView("home"); // Imposta la vista sulla home
    window.scrollTo(0, 0); // Scrolla in alto per mostrare subito la home
  };

  // Funzione per aprire il modal passando un libro specifico
  const handleShowDetail = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleRefresh = () => setRefresh(prev => prev + 1); // Funzione per forzare il refresh dei libri dopo operazioni CRUD

  const handleDelete = async (bookId) => {
    try {
        console.log("Tentativo di eliminazione libro con ID:", bookId);

        // Chiamata DELETE coerente con la tua handleSubmit
        const response = await axios.delete(`http://localhost:3000/onlinelibrary/books/${bookId}`, {
                                  headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
                                });

        setMessage(response.data.message);
        console.log(response.data);

        // Aggiorna lo stato per rimuovere il libro dalla UI istantaneamente
        setAllBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
        handleRefresh();

    } catch (err) {
        console.error(err);
        if (err.response?.status === 404) {
            setMessage(err.response.data.error);
        } else {
            setMessage(err.response.data.error || "Errore durante l'eliminazione");
        }
    }
  };

  const handleUpdate = async (bookId, updatedFormData) => {
  try {
    console.log("Tentativo di modifica libro con ID:", bookId);
    console.log("Nuovi dati:", updatedFormData);

  // Chiamata PUT coerente con lo stile delle altre funzioni
  const response = await axios.put(`http://localhost:3000/onlinelibrary/books/${bookId}`, {
    ...updatedFormData,
    publicationYear: Number(updatedFormData.publicationYear),
    ISBN: Number(updatedFormData.ISBN),
    copiesNumber: Number(updatedFormData.copiesNumber),
    }, 
    {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
    }
  );
    handleRefresh(); // Aggiorna la lista dei libri dopo l'aggiornamento

    console.log("Risposta server:", response.data);

    // Aggiorna lo stato allBooks: cerca il libro modificato e sostituiscilo con i nuovi dati
    if (response.data.updatedBook) {
      setAllBooks(prevBooks => 
        prevBooks.map(book => {
          // Aggiungiamo un controllo di sicurezza per 'book'
          if (!book) return book; 
          return book._id === bookId ? response.data.updatedBook : book;
        })
      );
      setMessage(response.data.message);
    } else {
      handleRefresh();
      setMessage("Libro aggiornato, ma non ho ricevuto i dati aggiornati dal server.");
      
    }
  } catch (err) {
    console.error(err);
    if (err.response?.status === 400) {
      // Gestione errori di validazione (es. campi mancanti)
      const errors = err.response.data.errors;
      setMessage(errors ? errors.map(e => e.msg).join(", ") : err.response.data.error);
    } else if (err.response?.status === 404) {
      setMessage("Libro non trovato nel database.");
    } else {
      setMessage(err.response?.data?.error || "Errore durante la modifica");
    }
  }
};

const handleUpdateClick = (book) => {
  setBookToUpdate(book);
  setShowUpdateModal(true);
};

const handleLogout = () => {
    // 1. Reset dello stato React
    setCurrentUser(null);
    
    // 2. Rimozione dati dal browser
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    
    // Torna alla home
    setView("home");
    console.log("Utente sloggato");
  };

  const handleLoginSuccess = (userData) => {
    // Aggiorna lo stato globale con i dati dell'utente
    setCurrentUser(userData);
  };

  const [showAddModal, setShowAddModal] = useState(false); // Per il modal di aggiunta libro  

  const [showLoginModal, setShowLoginModal] = useState(false); // Per il modal di login
  const [showRegisterModal, setShowRegisterModal] = useState(false); // Per il modal di registrazione 
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Funzioni "Switch" per passare da uno all'altro
  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };
  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleOpenDeleteModal = (book) => {
    setBookToDelete(book); // Mostra modal elimminazione e salviamo l'intero libro per leggerne il titolo nel modal
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (bookToDelete) {
      await handleDelete(bookToDelete._id); // Chiamiamo la tua vecchia funzione usando l'ID
      setShowDeleteModal(false); // Chiudiamo il modal
      setBookToDelete(null); // Puliamo lo stato
    }
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
      <Header 
        onShowCatalog={handleShowCatalog} 
        onShowHome={handleShowHome} 
        onShowLogin={() => setShowLoginModal(true)} 
        user={currentUser} // Passa l'utente
        onShowProfileModal={() => setShowProfileModal(true)}
        onShowSecurityModal={() => setShowSecurityModal(true)}
        onShowAdminPanel={() => alert("Apertura pannello admin utenti in arrivo!")}
        onShowFavouritesPanel={() => alert("Questa funzionalità è in arrivo! Stay tuned!")}
        onShowAdminPanel={() => setShowAdminModal(true)} // <--- COLLEGAMENTO INTERFACCIA ADMIN
        onLogout={handleLogout} // Passa una funzione per resettare lo stato
      />
      
      <SearchBar 
        search={search} 
        setSearch={setSearch} 
        criteria={criteria} 
        setCriteria={setCriteria} 
        setView={setView}
        // Passiamo il booleano isAdmin (se currentUser è null, sarà false)
        isAdmin={currentUser?.isAdmin || false}
        onShowAddModal={() => setShowAddModal(true)} // Passa la funzione per mostrare il modal di aggiuntaq
      />
      

      {/* Visualizzazione condizionale */}
      {view === "home" ? (
        <HomeContent 
          allBooks={allBooks} 
          onShowDetail={handleShowDetail} 
          onGoToCatalog={() => setView("catalog")}
          onShowCatalog={handleShowCatalog}
        />
      ) : (
        // Se sto cercando, mostro la griglia filtrata dentro un Container per i margini
        <Container className="mt-3">
            <Books  
              searchTerm={search} 
              searchCriteria={criteria} 
              onShowDetail={handleShowDetail}
              onDelete={handleOpenDeleteModal}
              onUpdate={handleUpdateClick}
              // Passiamo il booleano isAdmin (se currentUser è null, sarà false)
              isAdmin={currentUser?.isAdmin || false}
              refresh={refresh} // Passa lo stato di refresh per forzare il ricaricamento dopo operazioni CRUD
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
        onRefresh={handleRefresh} // Passa la funzione per aggiornare la lista dopo l'aggiunta
      />

      <UpdateBookModal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        bookP={bookToUpdate}
        onUpdate={handleUpdate}
        onRefresh={handleRefresh} // Passa la funzione per aggiornare la lista dopo l'aggiornamento
      />

      <LoginModal 
        show={showLoginModal} 
        onHide={() => setShowLoginModal(false)} 
        onSwitchToRegister={switchToRegister} 
        onLoginSuccess={handleLoginSuccess}
      />

      <RegisterModal 
        show={showRegisterModal} 
        onHide={() => setShowRegisterModal(false)} 
        onSwitchToLogin={switchToLogin} 
      />

      <ProfileModal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        user={currentUser}
        onUpdateSuccess={(updatedUser) => setCurrentUser(updatedUser)} // Aggiorna lo stato nel padre
      />

      {/* MODALE SICUREZZA ACCOUNT */}
      <SecurityModal
        show={showSecurityModal}
        onHide={() => setShowSecurityModal(false)}
        user={currentUser}
        onLogout={handleLogout} // Passa la tua funzione di logout esistente
        onUpdateSuccess={(updatedUser) => setCurrentUser(updatedUser)} // Aggiorna lo stato nel padre

      />

      {/* MODALE AREA RISERVATA ADMIN */}
      <AdminUsersModal
        show={showAdminModal}
        onHide={() => setShowAdminModal(false)}
        currentUser={currentUser}
      />

      <DeleteConfirmModal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)} 
        onConfirm={handleConfirmDelete}
        bookTitle={bookToDelete?.title} 
      />

    </>
      
      
  );
}

export default App;