import BookCarousel from './BookCarousel.jsx';
import { Button, Container } from 'react-bootstrap';

function HomeContent({ allBooks }) {
  
  // LOGIC: Filtering books for categories
  // Staff Picks: Let's pretend books with ID 1 to 8 are our favorites
  const staffPicks = allBooks.slice(0, 10); 
  
  // New Arrivals: Books sorted by year (descending)
  const newArrivals = [...allBooks]
    .sort((a, b) => b.publicationYear - a.publicationYear)
    .slice(0, 10);

  const mainSectionStyle = {
    backgroundColor: '#107c91', // Matching the teal/blue background from your screenshot
    paddingBottom: '60px',
    width: '100vw',
    marginLeft: 'calc(-50vw + 50%)'
  };

  return (
    <div style={mainSectionStyle}>
      {/* SECTION 1: STAFF PICKS */}
      <BookCarousel title="Staff Picks of the Week" books={staffPicks} />

      {/* SECTION 2: NEW ARRIVALS */}
      <BookCarousel title="New Arrivals" books={newArrivals} />

      {/* BROWSE BUTTON: Exactly like "Screenshot 2026-05-01 131714.jpg" */}
      <Container className="text-center mt-5">
        <Button 
          variant="warning" 
          style={{ 
            backgroundColor: '#ffc107', 
            border: 'none',
            padding: '12px 40px',
            fontWeight: '800',
            fontSize: '1.2rem',
            borderRadius: '5px',
            color: '#333'
          }}
        >
          Browse Catalog &rarr;
        </Button>
      </Container>
    </div>
  );
}

export default HomeContent;