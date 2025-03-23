import express from "express";
import db from "../db.js";
import pool from "../db.js"; // ou ton fichier de connexion DB
const router = express.Router();

// Récupérer tous les tags1
router.get("/tags1", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM TAG1");
        res.json(rows);
    } catch (error) {
        console.error("Erreur tags1 :", error);
        res.status(500).json({ error: "Erreur serveur tags1" });
    }
});

// Récupérer tous les tags2
router.get("/tags2", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM TAG2");
        res.json(rows);
    } catch (error) {
        console.error("Erreur tags2 :", error);
        res.status(500).json({ error: "Erreur serveur tags2" });
    }
});

// Récupérer tous les tags3
router.get("/tags3", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM TAG3");
        res.json(rows);
    } catch (error) {
        console.error("Erreur tags3 :", error);
        res.status(500).json({ error: "Erreur serveur tags3" });
    }
});
router.post("/filtrage-associations", async (req, res) => {
    const { tag1, tag2, tag3 } = req.body;

    try {
        let query = "SELECT * FROM ASSOCIATIONS WHERE 1=1";
        const params = [];

        if (tag1) {
            query += " AND IdTag1 = ?";
            params.push(tag1);
        }
        if (tag2) {
            query += " AND IdTag2 = ?";
            params.push(tag2);
        }
        if (tag3) {
            query += " AND IdTag3 = ?";
            params.push(tag3);
        }

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error("❌ Erreur lors du filtrage :", error);
        res.status(500).json({ error: "Erreur serveur lors du filtrage" });
    }
});

export default router;
