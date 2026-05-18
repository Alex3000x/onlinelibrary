import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import connectDB from "./db.js";

const PORT = 3000;
const app = express();

// Segreti per JWT (più avanti dovrebbero essere nell'.env e non hardcoded)
const ACCESS_SECRET = "4a8f9c2d1b5e7f3a0d6c8b9a2f4e1d7c3b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e";
const REFRESH_SECRET = "d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8";

// Middleware di autenticazione per verificare il token JWT nelle rotte protette
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // formato: "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: "Token mancante" });
    }

    try {
        const decoded = jwt.verify(token, ACCESS_SECRET);
        req.user = decoded; // passa i dati utente alle rotte successive
        next();
    } catch (err) {
        return res.status(403).json({ error: "Token non valido o scaduto" });
    }
};

// Funzione helper aggiornata per verificare la validità del campo cover o generarlo dall'ISBN se non valido
async function checkOpenLibraryCover(coverUrl, isbn) {
    let finalUrl = coverUrl ? coverUrl.toString().trim() : "";
    const cleanISBN = isbn ? isbn.toString().trim() : "";

    // Se il campo cover è vuoto ma abbiamo un ISBN valido, proviamo a comporre l'URL di OpenLibrary
    if (finalUrl === "" && cleanISBN !== "" && cleanISBN !== "N/A") {
        finalUrl = `https://covers.openlibrary.org/b/isbn/${cleanISBN}-L.jpg`;
    }

    // Se dopo questo controllo non abbiamo ancora nessun URL valido o c'è già il fallback, restituisci il locale
    if (finalUrl === "" || finalUrl === "/IMG_16663.PNG") {
        return "/IMG_16663.PNG";
    }

    // Se l'URL non appartiene a OpenLibrary (è un link esterno inserito a mano), lo consideriamo valido d'ufficio
    if (!finalUrl.includes("openlibrary.org")) {
        return finalUrl;
    }

    try {
        // Eseguiamo una fetch sul server di OpenLibrary per esaminare l'immagine reale restituita
        const response = await fetch(finalUrl);
        if (!response.ok) return "/IMG_16663.PNG";

        // Convertiamo la risposta in arrayBuffer per leggerne il peso reale in byte
        const arrayBuffer = await response.arrayBuffer();
        const bufferSize = arrayBuffer.byteLength;

        // Se l'immagine pesa meno di 100 byte, si tratta del pixel trasparente vuoto 1x1 di OpenLibrary
        if (bufferSize < 100) {
            return "/IMG_16663.PNG";
        }

        // Se supera il controllo, restituisce l'URL della copertina reale verificata
        return finalUrl;
    } catch (error) {
        console.error("Errore durante il controllo della copertina:", error);
        return "/IMG_16663.PNG"; // In caso di crash o timeout di rete, paracadute locale sicuro
    }
}

app.use(express.json());
app.use(cors()); // abilita CORS per tutte le rotte

let db; 

// GET /topinibrary/books?property= - Retrieve books by title, author, publication year, genre, ISBN, publisher, or language
app.get("/topinibrary/books", async (req, res, next) => {
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
        const books = await booksCollection.find(filter).toArray();
        res.json(books);
    }
    catch (err) {
    next(err);
    }});

// GET /topinibrary/books/1984 - Retrieve a book by its title
app.get("/topinibrary/books/:title", async (req, res, next) => {
    try {
        const_booksCollection = db.collection("books");

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

// GET /topinibrary/books/69fcd5014141996a9fbeaa28 - Retrieve a book by its _id
app.get("/topinibrary/books/:id", async (req, res, next) => {
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

// POST /topinibrary/books - Add a new book to the library
app.post("/topinibrary/books", verifyToken, async (req, res, next) => {
    try {
        // BLOCCO DI SICUREZZA: Impedisce l'accesso agli utenti non admin
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: "Accesso negato. Solo gli amministratori possono aggiungere libri." });
        }

        const booksCollection = db.collection("books");

        // MODIFICATO: Esegue il controllo reale sui byte del campo cover inviato dal frontend prima di procedere
        const validatedCover = await checkOpenLibraryCover(req.body.cover, req.body.ISBN);

        const newBook = {
            title: req.body.title,
            author: req.body.author,
            publicationYear: (isNaN(Number(req.body.publicationYear)) || Number(req.body.publicationYear) <= 0) ? null : Number(req.body.publicationYear),
            genre: req.body.genre,
            ISBN: req.body.ISBN ? req.body.ISBN.toString().trim() : "", // assicura che l'ISBN sia una stringa se non fornito
            publisher: req.body.publisher,
            available: req.body.available,
            description: req.body.description,
            language: req.body.language,
            copiesNumber: Number(req.body.copiesNumber),
            cover: validatedCover};

        const book = await booksCollection.insertOne(newBook);

        res.status(201).json({
        message: "Book added to the library",
        id: book.insertedId
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

// DELETE /topinibrary/books/69fcd5014141996a9fbeaa28 - Remove a book from the library by its _id
app.delete("/topinibrary/books/:id", verifyToken, async (req, res, next) => {
    try {
        // BLOCCO DI SICUREZZA
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: "Accesso negato. Solo gli amministratori possono eliminare libri." });
        }

        const booksCollection = db.collection("books");
        const { id } = req.params; // Estrae l'ID dall'URL

        console.log("ID da eliminare:", id);

        // Trasforma la stringa in un vero ObjectId di MongoDB, perché nel database l'ID è memorizzato como ObjectId, non come stringa
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

// PUT /topinibrary/books/69fcd5014141996a9fbeaa28 - Update the details of a book by its _id
app.put("/topinibrary/books/:id", verifyToken, async (req, res, next) => {
    try {
        // BLOCCO DI SICUREZZA
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: "Accesso negato. Solo gli amministratori possono modify libri." });
        }

        const booksCollection = db.collection("books");
        const { id } = req.params; // Estrae l'ID dall'URL

        // MODIFICATO: Esegue il controllo preventivo dei byte sulla cover inviata, ricalcolando l'immagine se l'ISBN o la cover sono variati
        const validatedCover = await checkOpenLibraryCover(req.body.cover, req.body.ISBN);

        const updatedBook = {
            title: req.body.title,
            author: req.body.author,
            publicationYear: (isNaN(Number(req.body.publicationYear)) || Number(req.body.publicationYear) <= 0) ? null : Number(req.body.publicationYear),
            genre: req.body.genre,
            ISBN: req.body.ISBN ? req.body.ISBN.toString().trim() : "", // assicura che l'ISBN sia una stringa se non fornito
            publisher: req.body.publisher,
            available: req.body.available,
            description: req.body.description,
            language: req.body.language,
            copiesNumber: Number(req.body.copiesNumber),
            cover: validatedCover
        };

        const book = await booksCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updatedBook },
            { returnDocument: "after" } // restituisce il documento aggiornato
        );
        if (!book) {
            return res.status(404).json({ 
                error: "Libro non trovato nel database." 
            });
        }

        // Risposta di successo coerente con ciò che il tuo frontend si aspetta
        res.status(200).json({
        message: "Libro aggiornato con successo",
        updatedBook: book.value
        });

    } catch (err) {
        console.error("Errore lato server durante la PUT:", err);
        
        // Gestione errori generica (es. ID non valido)
        res.status(500).json({ 
            error: "Si è verificato un errore interno durante l'aggiornamento del libro." 
        });
        next(err);
    }
});

// POST /topinibrary/register - Register a new user
app.post("/topinibrary/register", async (req, res, next) => {
    try {
        const usersCollection = db.collection("users");

        // Controlla se l'email esiste già
        const existing = await usersCollection.findOne({ email: req.body.email });
        if (existing) {
            return res.status(409).json({ error: "Email già registrata" });
        }

        // Hasha la password prima di salvarla
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            username: req.body.username,
            avatarUrl: req.body.avatarUrl || "https://cdn-icons-png.flaticon.com/512/1144/1144760.png", // Imposta un avatar di default se non fornito
            email: req.body.email,
            password: hashedPassword,
            isAdmin: false, // chi si registra all'inizio non è mai admin
            createdAt: new Date().toISOString()
        };

        await usersCollection.insertOne(newUser);
        res.status(201).json({ message: "Utente registrato con successo" });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                error: "code already exists"
            });
        }
        next(err);
    }
});

// POST /topinibrary/login - Authenticate a user and return a JWT token
app.post("/topinibrary/login", async (req, res, next) => {
    try {
        const usersCollection = db.collection("users");

        // Cerca l'utente per email
        const user = await usersCollection.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: "Email non esistente" });
        }

        // Confronta la password inserita con quella hashata nel DB
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Password non valida" });
        }

        // Crea i due token
        const accessToken = jwt.sign(
            { id: user._id.toString(), email: user.email, isAdmin: user.isAdmin },
            ACCESS_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user._id.toString() },
            REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user._id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                dateOfBirth: user.dateOfBirth,
                username: user.username,
                avatarUrl: user.avatarUrl,
                email: user.email,
                password: user.password,
                username: user.username,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt
            }
        });

    } catch (err) {
        next(err);
    }
});

// POST /topinibrary/refresh - Refresh the access token using a refresh token
app.post("/topinibrary/refresh", async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ error: "Refresh token mancante" });
        }

        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

        const accessToken = jwt.sign(
            { id: decoded.id },
            ACCESS_SECRET,
            { expiresIn: "15m" }
        );

        res.json({ accessToken });

    } catch (err) {
        return res.status(403).json({ error: "Refresh token non valido o scaduto" });
    }
});

// ==========================================
// 1. UTENTI LOGGATI: AGGIORNAMENTO PROFILO
// ==========================================
app.put("/topinibrary/users/:id", verifyToken, async (req, res, next) => {
    try {
        // Sicurezza: Un utente standard può modificare SOLO il proprio profilo
        if (req.user.id !== req.params.id && !req.user.isAdmin) {
            return res.status(403).json({ error: "Accesso negato. Non puoi modificare questo profilo." });
        }

        const usersCollection = db.collection("users");
        const userId = new ObjectId(req.params.id);

        const updateData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            username: req.body.username,
            avatarUrl: req.body.avatarUrl // Il nuovo campo per l'immagine
        };

        const result = await usersCollection.updateOne(
            { _id: userId },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Utente non trovato" });
        }

        res.json({ message: "Profilo aggiornato con successo" });
    } catch (err) {
        next(err);
    }
});

// ==========================================
// 2. UTENTI LOGGATI: MODIFICA INDIRIZZO EMAIL
// ==========================================
app.patch("/topinibrary/users/:id/email", verifyToken, async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ error: "Non autorizzato." });
        }

        const { newEmail, confirmPassword } = req.body;
        const usersCollection = db.collection("users");
        const userId = new ObjectId(req.params.id);

        // 1. Cerca l'utente nel DB per verificare la password
        const user = await usersCollection.findOne({ _id: userId });
        if (!user) return res.status(404).json({ error: "Utente non trovato" });

        // 2. Controllo password tramite bcrypt
        const isPasswordCorrect = await bcrypt.compare(confirmPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Password di conferma errata" });
        }

        // 3. Controllo se la nuova email è già usata da qualcun altro
        const emailExists = await usersCollection.findOne({ email: newEmail });
        if (emailExists) {
            return res.status(409).json({ error: "Questo indirizzo email è già in uso" });
        }

        // 4. Aggiorna l'email
        await usersCollection.updateOne({ _id: userId }, { $set: { email: newEmail } });

        res.json({ message: "Email aggiornata con successo" });
    } catch (err) {
        next(err);
    }
});

// ==========================================
// 3. UTENTI LOGGATI: CAMBIO PASSWORD
// ==========================================
app.patch("/topinibrary/users/:id/password", verifyToken, async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ error: "Non autorizzato." });
        }

        const { current, new: newPassword } = req.body;
        const usersCollection = db.collection("users");
        const userId = new ObjectId(req.params.id);

        const user = await usersCollection.findOne({ _id: userId });
        if (!user) return res.status(404).json({ error: "Utente non trovato" });

        // Verifica vecchia password
        const isPasswordCorrect = await bcrypt.compare(current, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "La password attuale è errata" });
        }

        // Hash della nuova password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Salva nel DB
        await usersCollection.updateOne({ _id: userId }, { $set: { password: hashedNewPassword } });

        res.json({ message: "Password aggiornata con successo" });
    } catch (err) {
        next(err);
    }
});

// ==========================================
// 4. UTENTI LOGGATI: ELIMINAZIONE ACCOUNT
// ==========================================
app.delete("/topinibrary/users/:id", verifyToken, async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id && !req.user.isAdmin) {
            return res.status(403).json({ error: "Azione non autorizzata." });
        }

        const usersCollection = db.collection("users");
        const result = await usersCollection.deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Utente non trovato" });
        }

        res.json({ message: "Account eliminato definitivamente" });
    } catch (err) {
        next(err);
    }
});

// ==========================================================
// 5. AREA RISERVATA ADMIN: GET TUTTI GLI UTENTI
// ==========================================================
app.get("/topinibrary/users", verifyToken, async (req, res, next) => {
    try {
        // BLOCCO DI SICUREZZA: Solo chi ha isAdmin nel token può passare
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: "Accesso negato. Area riservata agli amministratori." });
        }

        const usersCollection = db.collection("users");
        
        // Estraiamo tutti gli utenti ma ESCLUDIAMO il campo password per sicurezza
        const allUsers = await usersCollection.find({}, { projection: { password: 0 } }).toArray();

        res.json(allUsers);
    } catch (err) {
        next(err);
    }
});

// ==========================================================
// 6. AREA RISERVATA ADMIN: CAMBIO RUOLO UTENTE (SWITCH)
// ==========================================================
app.patch("/topinibrary/admin/users/:id/role", verifyToken, async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: "Accesso negato." });
        }

        const usersCollection = db.collection("users");
        const userId = new ObjectId(req.params.id);

        // Impedisci all'admin di declassare se stesso dall'interfaccia
        if (req.user.id === req.params.id) {
            return res.status(400).json({ error: "Non puoi revocare i permessi admin a te stesso." });
        }

        await usersCollection.updateOne(
            { _id: userId },
            { $set: { isAdmin: req.body.isAdmin } }
        );

        res.json({ message: "Ruolo utente aggiornato correttamente" });
    } catch (err) {
        next(err);
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