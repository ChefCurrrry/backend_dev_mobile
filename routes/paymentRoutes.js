import Stripe from 'stripe';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); // ✅ pour charger les variables d’environnement

const router = express.Router();

// Assure-toi que ta clé est bien définie
if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ STRIPE_SECRET_KEY manquante dans le .env");
    throw new Error("STRIPE_SECRET_KEY est requise");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

// ✅ Route pour créer un paiement Stripe
router.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
        return res.status(400).json({ error: "Montant invalide" });
    }

    console.log("📦 Paiement demandé :", amount, "centimes");

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // déjà en centimes depuis le front
            currency: 'eur',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        console.log("✅ PaymentIntent créé :", paymentIntent.id);

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err) {
        console.error("❌ Erreur lors de la création du paiement :", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;