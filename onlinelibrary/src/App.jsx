import {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Books from './components/Books';
import SearchBar from './components/SearchBar';
import Header from './components/Header';

function App() 
{
  console.log("APP()");
  const [search, setSearch] = useState("");
  const [criteria, setCriteria] = useState("title"); // "title" è il default  


  // // funzione per aggiornare array dei commenti
  // function addComment(comment) {
  //   //comments.push(comment) // NOOOOOO!!!! IN REACT!! comments variabile di stato, renderizzazione componente 
  //   setComments((cs) => [...cs,comment]);  
  // }


  return (
    <Container>
      
      <Header />
      {/* Usiamo il componente a parte */}
      <SearchBar search={search} setSearch={setSearch} />

      <p>Search term: {search}</p>
      <p>Search criteria: {criteria}</p>

      {/* Passiamo il valore a Books */}
      <Books searchTerm={search} searchCriteria={criteria} />

    </Container>
    // <> </> fragment - container fake, mi serve perchè se no mi da errore tutorial, non è però un vero contenitore aggiuntivo
    // per far passare lista di elementi senza creare per forza un contenitore HTML
    //  <Tutorial tutorialP={tutorials[0]} /> sto passando oggetto che andrò a riconoscere tramite TutorialP
    // devo mettere le graffe perchè sto passando un oggetto JS - inietto info JS e quindi per forza graffe
  )
}

export default App;

// definisco percorso per recuperare immagine - associo immagine a identificativo (che uso poi nell'array)
// ./ -> percorso relativo, parte da cartella corrente in cui si trova file, comincia da directory in cui c'è App.jsx
// sistema crea un puntatore a quell'immagine e lo salva dentro un nome che definiamo noi al momento -> reactImg

//App rimane molto pulita, perchè abbiamo delegato tutorials e gestire tutte le problematiche, compresa 
// parte di allineamento e distribuzione

