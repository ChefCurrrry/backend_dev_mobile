import express from "express";
import pool from "../db.js";

const router = express.Router();

// Route pour récupérer toutes les associations
router.get("/getAsso", async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT * FROM ASSOCIATION ORDER BY NomAsso");
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
        let query = "SELECT * FROM ASSOCIATION WHERE 1=1";
        const params = [];

        if (tag1) {
            query += " AND TAG1 = ?";
            params.push(tag1);
        }
        if (tag2) {
            query += " AND TAG2 = ?";
            params.push(tag2);
        }
        if (tag3) {
            query += " AND TAG3 = ?";
            params.push(tag3);
        }
        console.log("🧪 SQL DEBUG:", query);
        console.log("🧪 Params:", params);

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error("❌ Erreur lors du filtrage :", error);
        res.status(500).json({ error: "Erreur serveur lors du filtrage" });
    }
});


router.get('/getAssoById', async (req, res) => {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "ID manquant" });

    try {
        const result = await pool.query("SELECT * FROM ASSOCIATION WHERE IdAsso = ?", [id]);
        if (result[0].length === 0) {
            return res.status(404).json({ error: "Association non trouvée" });
        }
        res.json(result[0][0]);
    } catch (err) {
        res.status(500).json({ error: "Erreur récupération association" });
    }
});



export default router;