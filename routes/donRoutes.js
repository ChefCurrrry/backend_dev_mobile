import express from "express";
import pool from "../db.js";

const router = express.Router();


router.get("/somme", async (req, res) => {
    const idAsso = req.query.id;

    try {
        const [rows] = await pool.execute(
            "SELECT SUM(MontantDon) AS total FROM DONS WHERE IdAsso = ?",
            [idAsso]
        );

        res.json({ total: rows[0].total || 0 });
    } catch (err) {
        console.error("Erreur récupération des dons :", err);
        res.status(500).json({ error: "Erreur récupération dons" });
    }
});

router.post("/registerDon", async (req, res) => {
    const { idUtilisateur, idAssociation, montant, date } = req.body;

    console.log("Reçu du front :", req.body); // 👈 AJOUTE ÇA ICI

    if (!idAssociation || !montant) {
        return res.status(400).json({ success: false, message: "Champs manquants" });
    }

    const query = `INSERT INTO DONS (IdUser, IDAsso, MontantDon, DateDon) VALUES (?, ?, ?, ?)`;

    try {
        await pool.query(query, [idUtilisateur, idAssociation, montant, date || new Date()]);
        res.status(201).json({ success: true, message: "Don enregistré avec succès" });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement du don :", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

router.post("/registerRecurrentDon", async (req, res) => {
    const { idUtilisateur, idAssociation, montant, date } = req.body;

    if (!idUtilisateur || !idAssociation || !montant || !date) {
        return res.status(400).json({ success: false, message: "Champs manquants" });
    }

    try {
        const insertRecurrentQuery = `
            INSERT INTO DONS_RECURRENTS (IdUser, IDAsso, MontantDon, DatePremierDon)
            VALUES (?, ?, ?, ?)
        `;
        await pool.query(insertRecurrentQuery, [idUtilisateur, idAssociation, montant, date]);

        const insertOneTimeQuery = `
            INSERT INTO DONS (IdUser, IDAsso, MontantDon, DateDon)
            VALUES (?, ?, ?, ?)
        `;
        await pool.query(insertOneTimeQuery, [idUtilisateur, idAssociation, montant, date]);

        res.status(201).json({ success: true, message: "Don récurrent et premier don enregistrés" });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement du don récurrent :", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});




export default router;
