import BookCarousel from './BookCarousel.jsx';
import { Button, Container } from 'react-bootstrap';

function HomeContent({ allBooks, onShowDetail, onShowCatalog }) {
  
  // LOGIC: Filtering books for categories
  // Staff Picks: Let's pretend books with ID 1 to 8 are our favorites
  const staffPicks = allBooks.slice(0, 10); 
  
  // New Arrivals: Books sorted by year (descending)
  const newArrivals = [...allBooks]
    .sort((a, b) => b.publicationYear - a.publicationYear)
    .slice(0, 10);

  const mainSectionStyle = {
    backgroundColor: '#BCD3E0', 
    paddingBottom: '60px',
    width: '100vw',
    marginLeft: 'calc(-50vw + 50%)'
  };

  return (
    <div style={mainSectionStyle}>
      {/* SECTION 1: STAFF PICKS */}
      <BookCarousel title="Scelti dallo staff" books={staffPicks} onShowDetail={onShowDetail} />

      {/* SECTION 2: NEW ARRIVALS */}
      <BookCarousel title="Nuovi arrivi" books={newArrivals} onShowDetail={onShowDetail}/>

      {/* BROWSE BUTTON: Exactly like "Screenshot 2026-05-01 131714.jpg" */}
      <Container className="text-center mt-5">
        <Button 
          variant="warning" 
          onClick={onShowCatalog}
          style={{ 
            backgroundColor: '#e190b6', 
            border: 'none',
            padding: '12px 40px',
            fontWeight: '800',
            fontSize: '1.2rem',
            borderRadius: '5px',
            color: '#fffcee'
          }}
        >
          Sfoglia il catalogo &rarr;
        </Button>
      </Container>
    </div>
  );
}

export default HomeContent;