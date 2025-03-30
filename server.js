import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import {resolve} from "path";
import associationRoutes from "./routes/associationRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import donRoutes from "./routes/donRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config({ path: resolve("backend/.env") });

const app = express();
app.use(express.json()); // Permet d'interpréter les requêtes JSON
app.use(cors()); // Autorise les requêtes depuis React Native

// Routes API
app.use("/api/users", userRoutes);
app.use("/api/associations", associationRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/dons", donRoutes);
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`));