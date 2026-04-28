import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

function Book({ bookP }) {
    console.log("Book()");

    return (
        <Card className='w-100'>
            <Card.Header as="h5">📚 {bookP.title}</Card.Header>
            <Card.Body>
                <Card.Text>{bookP.author}</Card.Text>
                <Card.Text>Editor: {bookP.publisher}</Card.Text>
            </Card.Body>
            <ListGroup variant="flush">
                <ListGroup.Item>� Lingua: {bookP.language}</ListGroup.Item>
                <ListGroup.Item>💰 Genere: €{bookP.genre}</ListGroup.Item>
                <ListGroup.Item>⭐ Descrizione: {bookP.description}</ListGroup.Item>
            </ListGroup>
        </Card>
    )
}

export default Book;