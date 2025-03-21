import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import {resolve} from "path";
import associationRoutes from "./routes/associationRoutes.js";
import filtrageRoutes from "./routes/filtrageRoutes.js";

dotenv.config({ path: resolve("backend/.env") });

const app = express();
app.use(express.json()); // Permet d'interpréter les requêtes JSON
app.use(cors()); // Autorise les requêtes depuis React Native


app.use("/api/users", userRoutes);
app.use("/api/associations", associationRoutes);
app.use("/api", filtrageRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`));