const express = require("express");
const router = express.Router();
const db = require("../db"); // Assure-toi que c'est bien ton fichier de connexion DB

router.post("/", async (req, res) => {
    const { tag1, tag2, tag3 } = req.body;

    try {
        let query = `
            SELECT * FROM ASSOCIATION 
            WHERE (TAG1 = ? OR TAG2 = ? OR TAG3 = ?)
            OR    (TAG1 = ? OR TAG2 = ? OR TAG3 = ?)
            OR    (TAG1 = ? OR TAG2 = ? OR TAG3 = ?)
        `;

        const params = [tag1, tag1, tag1, tag2, tag2, tag2, tag3, tag3, tag3].map(t => t || null);

        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (err) {
        console.error("❌ Erreur lors du filtrage :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;
