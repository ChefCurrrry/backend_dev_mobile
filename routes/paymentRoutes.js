import Stripe from 'stripe';
import express from 'express';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

// Exemple de route pour créer un paiement
router.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // en centimes
            currency: 'eur',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err) {
        console.error("Erreur Stripe :", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
