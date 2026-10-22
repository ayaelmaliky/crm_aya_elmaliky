const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion MongoDB Atlas via Mongoose
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connecté avec succès à MongoDB Atlas'))
.catch(err => console.error('Erreur de connexion MongoDB :', err));

// Schéma et Modèle Mongoose
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true }
});
const Item = mongoose.model('Item', itemSchema);

// Route de santé (Health check)
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Le serveur backend fonctionne correctement.' });
});

// GET /api/items : Récupérer tous les éléments
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des éléments.' });
    }
});

// POST /api/items : Créer un élément (avec prévention des doublons)
app.post('/api/items', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Le champ name est obligatoire.' });
        }

        const trimmedName = name.trim();

        // Test D (Précaution anti-doublons en cas de nouvelle tentative / retry)
        const existingItem = await Item.findOne({ name: trimmedName });
        if (existingItem) {
            return res.status(200).json(existingItem);
        }

        const newItem = new Item({ name: trimmedName });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l’ajout de l’élément.' });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});