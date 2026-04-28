import express from 'express';
import cors from 'cors';
import connectDB from "./db.js";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cors()); // abilita CORS per tutte le rotte

let db; 

// GET /library - Retrieve all books, no filter
app.get("/library", async (req, res, next) => {
    try {
        const booksCollection = db.collection("books");
        const filter = {};

        // // name filter (multiple values)
        // if (req.query.name) {
        //     const names = req.query.name.split(",");
        //     filter.name = { $in: names};
        // }

        // // Magnitude greater than threshold
        // if(req.query.minMagnitude) {
        //     filter.magnitude = { $gt: Number(req.query.minMagnitude) };
        // }
        // console.log(filter);
        const onlinelibrary = await booksCollection.find(filter).toArray();
        res.json(onlinelibrary);
    }
    catch (err) {
    next(err);
    }});


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