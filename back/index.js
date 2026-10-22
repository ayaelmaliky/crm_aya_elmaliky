const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connexion MongoDB Mongoose
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connexion à MongoDB Atlas réussie !'))
  .catch((err) => console.error('Erreur de connexion à MongoDB :', err));

// Schéma et Modèle Mongoose pour les items
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true }
});
const Item = mongoose.model('Item', itemSchema);

// Route Health
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Le serveur répond correctement' });
});

// Route GET /api/items (Récupérer depuis MongoDB)
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur lors de la récupération' });
  }
});

// Route POST /api/items (Créer dans MongoDB)
app.post('/api/items', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Le champ name est requis' });
    }
    const newItem = new Item({ name });
    await newItem.save();
    res.status(201).json({ message: 'Item créé avec succès', item: newItem });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur lors de la création' });
  }
});
// Route de test pour la racine du backend
app.get('/', (req, res) => {
  res.send("API CRM opérationnelle !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
const dns = require('dns');
dns.setServers(["1.1.1.1", "8.8.8.8"]);