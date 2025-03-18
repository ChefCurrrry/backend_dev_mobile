import express from "express";
import pool from "../db.js";

const router = express.Router();

// Route pour récupérer toutes les associations
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT * FROM ASSOCIATION");
        res.json(rows); // Retourne la liste des associations en JSON
    } catch (error) {
        console.error("Erreur lors de la récupération des associations :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

export default router;
