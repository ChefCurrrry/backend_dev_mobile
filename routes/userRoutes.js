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
            [nom, prenom, email, hashedPassword, "admin"]
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


router.post("/reset-password", async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ success: false, message: "Email et mot de passe requis." });
    }

    try {
        // Vérifie si l'utilisateur existe
        const [users] = await pool.query("SELECT * FROM UTILISATEUR WHERE Email = ?", [email]);

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "Aucun utilisateur trouvé avec cet email." });
        }

        // Hash le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Met à jour le mot de passe
        await pool.query("UPDATE UTILISATEUR SET Password = ? WHERE Email = ?", [hashedPassword, email]);

        return res.json({ success: true, message: "Mot de passe réinitialisé avec succès." });
    } catch (err) {
        console.error("Erreur reset password:", err);
        return res.status(500).json({ success: false, message: "Erreur serveur lors de la réinitialisation." });
    }
});


router.post("/updateRole", async (req, res) => {
    const { id, role } = req.body;

    if (!id || !role) {
        return res.status(400).json({ message: "ID et rôle requis." });
    }

    try {
        await pool.query("UPDATE UTILISATEUR SET Role = ? WHERE IdUSer = ?", [role, id]);
        res.json({ success: true, message: "Rôle mis à jour." });
    } catch (err) {
        console.error("❌ Erreur updateRole :", err);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
});

router.delete("/delete", async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "ID utilisateur requis." });
    }

    try {
        await pool.query("DELETE FROM UTILISATEUR WHERE IdUser = ?", [id]);
        res.json({ success: true, message: "Utilisateur supprimé." });
    } catch (err) {
        console.error("❌ Erreur deleteUser :", err);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
});
router.get("/getUser", async (req, res) => {
    const currentUserId = req.query.id; // 🔹 ID de l'utilisateur connecté passé dans la requête

    if (!currentUserId) {
        return res.status(400).json({ success: false, message: "ID utilisateur requis" });
    }

    try {
        const [users] = await pool.query(
            "SELECT IdUser AS id, Nom AS nom, Prenom AS prenom, Email AS email, Role AS role FROM UTILISATEUR WHERE IdUser != ?",
            [currentUserId]
        );
        res.json(users);
    } catch (err) {
        console.error("❌ Erreur récupération utilisateurs :", err);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
});

export default router;