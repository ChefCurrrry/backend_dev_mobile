import express from "express";
import db from "../db.js";
import pool from "../db.js"; // ou ton fichier de connexion DB
const router = express.Router();

// Récupérer tous les tags1
router.get("/tags1", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM TAG1 ORDER BY IdTag1");
        res.json(rows);
    } catch (error) {
        console.error("Erreur tags1 :", error);
        res.status(500).json({ error: "Erreur serveur tags1" });
    }
});

// Récupérer tous les tags2
router.get("/tags2", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM TAG2 ORDER BY IdTag2");
        res.json(rows);
    } catch (error) {
        console.error("Erreur tags2 :", error);
        res.status(500).json({ error: "Erreur serveur tags2" });
    }
});

// Récupérer tous les tags3
router.get("/tags3", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM TAG3 ORDER BY IdTag3");
        res.json(rows);
    } catch (error) {
        console.error("Erreur tags3 :", error);
        res.status(500).json({ error: "Erreur serveur tags3" });
    }
});


export default router;