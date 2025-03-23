import express from "express";
import pool from "../db.js"; // ou ton fichier de connexion DB
const router = express.Router();

// Récupérer tous les tags1
router.get("/", async (req, res) => {
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
