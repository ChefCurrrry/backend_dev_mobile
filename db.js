import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { resolve } from "path";

// Charger les variables d'environnement depuis `.env`
dotenv.config({ path: resolve("backend/.env") });

// Vérifier que les variables sont bien chargées
console.log("🔍 Vérification des variables d'environnement...");
console.log("MYSQL_HOST:", process.env.MYSQL_HOST);
console.log("MYSQL_USER:", process.env.MYSQL_USER);
console.log("MYSQL_DATABASE:", process.env.MYSQL_DATABASE);

// Connexion à la base de données MySQL
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
});

export default pool;
