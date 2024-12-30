import express from "express";
import path, {dirname} from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";


const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());


app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

// Routes
app.use('/auth', authRoutes);
app.use('/todos',authMiddleware, todoRoutes);



app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT} and is listening at http://localhost:${PORT}`)
});