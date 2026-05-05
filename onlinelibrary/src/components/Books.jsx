import { useState, useEffect } from "react";
import axios from "axios";
import Book from "./Book";


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
        <section>
            {/* <button onClick={onRefresh}>Refresh</button> */}
            {
                books.length > 0 ? (books.map((book) => (
                    <Book key={book._id} bookP={book}/>
                ))) : (
                    <p>Non ci sono libri disponibili!</p>
                )
            }


        </section>
    )
}

export default Books;                