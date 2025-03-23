import express from "express";
import pool from "../db.js";

const router = express.Router();

// Route pour récupérer toutes les associations
router.get("/getAsso", async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT * FROM ASSOCIATION");
        res.json(rows); // Retourne la liste des associations en JSON
    } catch (error) {
        console.error("Erreur lors de la récupération des associations :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Filtrer les associations selon les tags sélectionnés
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
