import express from 'express';
import cors from 'cors';
import { ObjectId } from 'mongodb';
import connectDB from "./db.js";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cors()); // abilita CORS per tutte le rotte

let db; 

// GET /onlinelibrary/books?property= - Retrieve books by title, author, publication year, genre, ISBN, publisher, or language
app.get("/onlinelibrary/books", async (req, res, next) => {
    try {
        const booksCollection = db.collection("books");
        const filter = {};

        // case tolerant filter by title (single value)
        if (req.query.title) {
            filter.title = {
                $regex: req.query.title.trim(),
                $options: "i" // case insensitive
            };
        }

        // case tolerant filter by author (single value)
        if (req.query.author) {
            filter.author = {
                $regex: req.query.author.trim(),
                $options: "i"
            };
        }

        // case tolerant filter by publicationYear (single value)
        if (req.query.publicationYear) {
            filter.publicationYear = {
                $regex: req.query.publicationYear.trim(),
                $options: "i"
            };
        }

        // case tolerant filter by genre (single value)
        if (req.query.genre) {
            filter.genre = {
                $regex: req.query.genre.trim(),
                $options: "i"
            };
        }

        // case tolerant filter by ISBN (single value)
        if (req.query.ISBN) {
            filter.ISBN = {
                $regex: req.query.ISBN.trim(),
                $options: "i"
            };
        }

        // case tolerant filter by publisher (single value)
        if (req.query.publisher) {
            filter.publisher = {
                $regex: req.query.publisher.trim(),
                $options: "i"
            };
        }

        // case tolerant filter by language (single value)
        if (req.query.language) {
            filter.language = {
                $regex: req.query.language.trim(),
                $options: "i"
            };
        }

        // case tolerant filter by all properties (single value)
        if (req.query.all) {
            const searchTerm = req.query.all.trim();
            filter.$or = [
                { title: { $regex: searchTerm, $options: "i" } },
                { author: { $regex: searchTerm, $options: "i" } },
                { publicationYear: { $regex: searchTerm, $options: "i" } },
                { genre: { $regex: searchTerm, $options: "i" } },
                { ISBN: { $regex: searchTerm, $options: "i" } },
                { publisher: { $regex: searchTerm, $options: "i" } },
                { language: { $regex: searchTerm, $options: "i" } }
            ];
        }

        console.log(filter);
        const onlinelibrary = await booksCollection.find(filter).toArray();
        res.json(onlinelibrary);
    }
    catch (err) {
    next(err);
    }});

// GET /onlinelibrary/books/1984 - Retrieve a book by its title
app.get("/onlinelibrary/books/:title", async (req, res, next) => {
    try {
        const booksCollection = db.collection("books");

        //2. case tolerant  
        const filter = {
            title: {
                $regex: `^${req.params.title}$`,
                $options: "i" // case insensitive
            }
        };

        const book = await booksCollection.find(filter).toArray();
        res.json(book);
    } catch (err) {
        next(err);
    }});

// GET /onlinelibrary/books/69fcd5014141996a9fbeaa28 - Retrieve a book by its _id
app.get("/onlinelibrary/books/:id", async (req, res, next) => {
    try {
        const booksCollection = db.collection("books");
        const { id } = req.params; // Estrae l'ID dall'URL

        const filter = {
            _id: new ObjectId(id) // Trasforma la stringa in un vero ObjectId di MongoDB
        };

        const book = await booksCollection.findOne(filter);

        console.log(book);

        //res.status(200).json(stars);
        res.json(book);

    } catch (err) {
        next(err);
    }
});

// POST /onlinelibrary/books - Add a new book to the library
app.post("/onlinelibrary/books", async (req, res, next) => {
    try {
        const booksCollection = db.collection("books");

        const newBook = {
        title: req.body.title,
        author: req.body.author,
        publicationYear: Number(req.body.publicationYear),
        genre: req.body.genre,
        ISBN: Number(req.body.ISBN),
        publisher: req.body.publisher,
        available: req.body.available,
        description: req.body.description,
        language: req.body.language,
        cover: req.body.cover};

        const result = await booksCollection.insertOne(newBook);

        res.status(201).json({
        message: "Book added to the library",
        id: result.insertedId
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                error: "code already exists"
            });
        }
        next(err);
    }
});

// DELETE /onlinelibrary/books/69fcd5014141996a9fbeaa28 - Remove a book from the library by its _id
app.delete("/onlinelibrary/books/:id", async (req, res, next) => {
    try {
        const booksCollection = db.collection("books");
        const { id } = req.params; // Estrae l'ID dall'URL

        console.log("ID da eliminare:", id);

        // Trasforma la stringa in un vero ObjectId di MongoDB
        const deletedBook = await booksCollection.deleteOne({ _id: new ObjectId(id) });

        if (deletedBook.deletedCount === 0) {
            return res.status(404).json({ 
                error: "Libro non trovato o già eliminato." 
            });
        }

        // Risposta di successo coerente con ciò che il tuo frontend si aspetta
        res.status(200).json({ 
            message: "Libro eliminato con successo dal sistema." 
        });

    } catch (err) {
        console.error("Errore lato server durante la DELETE:", err);
        
        // Gestione errori generica (es. ID non valido)
        res.status(500).json({ 
            error: "Si è verificato un errore interno durante l'eliminazione del libro." 
        });
    }
});

// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    error: err.message || "Something went wrong",
  });
});

async function startServer() {
    try{
        db = await connectDB();

        app.listen(PORT, () => {
            console.log(`server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);

        process.exit(1);
    }
}

startServer();