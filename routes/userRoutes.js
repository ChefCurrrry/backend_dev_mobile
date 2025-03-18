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
        // Vérifier si l'utilisateur existe
        const [rows] = await pool.execute("SELECT * FROM UTILISATEUR WHERE Email = ?", [email]);
        console.log("📝 Résultat SQL :", rows);

        if (rows.length === 0) {
            console.log("❌ Aucun utilisateur trouvé !");
            return res.status(400).json({ success: false, message: "Email ou mot de passe incorrect" });
        }

        // Vérifier si la colonne "Password" est bien récupérée
        const hashedPassword = rows[0].Password;
        console.log("🔒 Mot de passe récupéré :", hashedPassword);

        if (!hashedPassword) {
            console.log("❌ ERREUR : Aucune donnée trouvée pour password !");
            return res.status(500).json({ success: false, message: "Erreur serveur (password non trouvé)" });
        }

        // Vérification du mot de passe
        const isMatch = await bcrypt.compare(password, hashedPassword);
        console.log("🔑 Vérification bcrypt :", isMatch);

        if (!isMatch) {
            console.log("❌ Mot de passe incorrect !");
            return res.status(400).json({ success: false, message: "Email ou mot de passe incorrect" });
        }

        res.json({ success: true, message: "Connexion réussie !" });

    } catch (error) {
        console.error("❌ Erreur lors de la connexion :", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});
export default router;
