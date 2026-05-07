import express from 'express';
import cors from 'cors';
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

// 2 Esempio: GET /online/books/1984 - Retrieve a book by its code 
app.get("/online/books/:name", async (req, res, next) => {
    try {
        const booksCollection = db.collection("books");

        // // 1. case sensitive
        // const filter = {
        //     name: req.params.name
        // }; // filtro per nome

        //2. case tolerant
        const filter = {
            name: {
                $regex: `^${req.params.name}$`,
                $options: "i" // case insensitive
            }
        };

        const book = await booksCollection.find(filter).toArray();
        res.json(book);
    } catch (err) {
        next(err);
    }});

// GET /online/books/1 - Retrieve a book by its code
app.get("/online/books/:code", async (req, res, next) => {
    try {
        const booksCollection = db.collection("books");

        const filter = {
            code: parseInt(req.params.code)
        };

        const book = await booksCollection.findOne(filter);

        console.log(book);

        //res.status(200).json(stars);
        res.json(book);

    } catch (err) {
        next(err);
    }
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