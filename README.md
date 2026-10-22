# Application CRM - Gestion des Éléments (MERN Stack)

Application web de gestion d'éléments réalisée dans le cadre d'un projet d'examen MERN (MongoDB, Express.js, React/Vanilla JS, Node.js).

## 🚀 Technologies Utilisées

* **Frontend :** HTML5, CSS3, JavaScript (DOM Manipulation, Fetch API)
* **Backend :** Node.js, Express.js
* **Base de données :** MongoDB Atlas (Mongoose ORM)
* **Outils & Déploiement :** Nodemon, Dotenv, Git

---

## 📁 Structure du Projet

```text
crm_aya_elmaliky/
├── back/                # Serveur Backend (Node.js & Express)
│   ├── .env             # Variables d'environnement (MongoDB URI, Port)
│   ├── index.js         # Point d'entrée de l'application & API
│   └── package.json     # Dépendances Node.js
└── front/               # Interface Frontend
    ├── index.html       # Structure HTML de l'application
    ├── style.css        # Styles CSS
    └── index.js         # Logique JS (appel API / DOM)