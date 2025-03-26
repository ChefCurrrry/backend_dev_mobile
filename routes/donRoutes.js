import express from "express";
import pool from "../db.js";

const router = express.Router();


router.get("/somme", async (req, res) => {
    const idAsso = req.query.id;

    try {
        const [rows] = await pool.execute(
            "SELECT SUM(Montant) AS total FROM DON WHERE IdAsso = ?",
            [idAsso]
        );

        res.json({ total: rows[0].total || 0 });
    } catch (err) {
        console.error("Erreur récupération des dons :", err);
        res.status(500).json({ error: "Erreur récupération dons" });
    }
});

export default router;
