import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve("backend/.env") });

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
});

router.post("/create-payment-intent", async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Number(amount) * 100, // montant en centimes
            currency: "eur",
            payment_method_types: ["card"],
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Erreur Stripe :", error);
        res.status(500).send({ error: "Erreur lors de la création du paiement." });
    }
});

export default router;
