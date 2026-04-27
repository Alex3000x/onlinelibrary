import express from 'express';

const PORT = 3000;
const app = express();

app.use(express.json());

async function startServer() {
    try{
        app.listen(PORT, () => {
            console.log(`server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('fail to start server:', error);
        process.exit(1);
    }
}

startServer();