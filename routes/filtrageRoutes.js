const express = require("express");
const router = express.Router();
const db = require("../db"); // Vérifie bien que db.js est correctement importé

router.post("/api/filtrage-associations", async (req, res) => {
    let { tag1, tag2, tag3 } = req.body;

    // Vérifier que au moins un tag est envoyé
    if (!tag1 && !tag2 && !tag3) {
        return res.status(400).json({ message: "❌ Au moins un tag est requis !" });
    }

    try {
        let query = `
            SELECT * FROM ASSOCIATION
            WHERE (TAG1 = ? OR TAG2 = ? OR TAG3 = ?)
               OR (TAG1 = ? OR TAG2 = ? OR TAG3 = ?)
               OR (TAG1 = ? OR TAG2 = ? OR TAG3 = ?)
        `;

        const params = [tag1, tag1, tag1, tag2, tag2, tag2, tag3, tag3, tag3];

        const [rows] = await db.query(query, params); // Si MySQL, utilise `query`

        if (rows.length === 0) {
            return res.status(404).json({ message: "Aucune association trouvée avec ces tags." });
        }

        res.json(rows);
    } catch (err) {
        console.error("❌ Erreur SQL :", err);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
});

module.exports = router;
