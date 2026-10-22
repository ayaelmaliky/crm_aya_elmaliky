const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Route Health
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Le serveur repond correctement' });
});

// Route GET items (simulation ou base de données)
app.get('/api/items', (req, res) => {
  res.status(200).json({ items: [] });
});

// Route POST items
app.post('/api/items', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Le champ name est requis' });
  }
  res.status(201).json({ message: 'Item cree avec succes', item: { name } });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'execution sur le port ${PORT}`);
});