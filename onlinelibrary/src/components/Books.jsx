import { useState, useEffect } from "react";
import axios from "axios";
import Book from "./Book";
import { Row, Col } from "react-bootstrap";


function Books({searchTerm, searchCriteria})
{
    console.log("BOOKS()");

    const [books, setBooks] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);

    useEffect(() => {

        async function fetchPosts()
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

        fetchPosts();

    }, [searchTerm, searchCriteria]); 

    function onRefresh() {
        setRefresh(refresh + 1);
    }

    if(loading)
        return <p>Loading...</p>
    
    if(err)
        return <p>{err.message}</p>

    return (
  <Row xs={1} md={2} lg={3} className="g-4"> 
    {books.map(b => (
      <Col key={b._id}>
        <Book bookP={b} />
      </Col>
    ))}
  </Row>
);
}

export default Books;                