import express from "express";
import bcrypt from "bcryptjs";
import pool from "../db.js";

const router = express.Router();

// Route d'inscription
router.post("/register", async (req, res) => {
    const { nom, prenom, email, password } = req.body;

    try {
        // Vérifier si l'email existe déjà
        const [existingUsers] = await pool.execute("SELECT IdUser FROM UTILISATEUR WHERE Email = ?", [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ success: false, message: "L'email est déjà utilisé !" });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer l'utilisateur
        await pool.execute("INSERT INTO UTILISATEUR (Nom, Prenom, Email, Password, Role) VALUES (?, ?, ?, ?, ?)",
            [nom, prenom, email, hashedPassword, "user"]
        );

        res.status(201).json({ success: true, message: "Inscription réussie !" });

    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// Route de connexion
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("🔍 Tentative de connexion :", email, password);

    try {
        const [rows] = await pool.execute("SELECT * FROM UTILISATEUR WHERE Email = ?", [email]);

        if (rows.length === 0) {
            return res.status(400).json({ success: false, message: "Email ou mot de passe incorrect" });
        }

        const hashedPassword = rows[0].Password;

        if (!hashedPassword) {
            return res.status(500).json({ success: false, message: "Erreur serveur (password non trouvé)" });
        }

        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Email ou mot de passe incorrect" });
        }

        // ✅ On renvoie les infos du user
        res.json({
            success: true,
            message: "Connexion réussie !",
            user: {
                id: rows[0].IdUser,
                nom: rows[0].Nom,
                prenom: rows[0].Prenom,
                email: rows[0].Email,
                role: rows[0].Role,
            },
        });

    } catch (error) {
        console.error("❌ Erreur lors de la connexion :", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
export default router;
