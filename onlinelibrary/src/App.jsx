import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Books from './components/Books';
import SearchBar from './components/SearchBar';
import Header from './components/Header';
import HomeContent from './components/HomeContent'; // Il tuo nuovo componente
import Footer from './components/Footer';

function App() {
  console.log("APP()");
  const [search, setSearch] = useState("");
  const [criteria, setCriteria] = useState("all"); // "all" come criterio di default
  const [allBooks, setAllBooks] = useState([]);

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
      <Header />
      
      <SearchBar 
        search={search} 
        setSearch={setSearch} 
        criteria={criteria} 
        setCriteria={setCriteria} 
      />
      

      {/* Visualizzazione condizionale */}
      {!search ? (
        // Se non sto cercando, mostro i caroselli (Staff Picks & New Arrivals)
        <HomeContent allBooks={allBooks} />
      ) : (
        // Se sto cercando, mostro la griglia filtrata dentro un Container per i margini
        <Container className="mt-5">
            <p className="text-secondary">
                Search term: <strong>{search}</strong> | Criteria: <strong>{criteria}</strong>
            </p>
            <hr />
            <Books searchTerm={search} searchCriteria={criteria} />
        </Container>

        
      )}
      < Footer />
    </>
  );
}

export default App;