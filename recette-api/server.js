const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
console.log("Vérification du dossier 'uploads'...");

const uploadDir = path.join(__dirname, 'uploads');

// Vérifie si le dossier existe, sinon le crée
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Dossier "uploads" créé.');
} else {
  console.log('Le dossier "uploads" existe déjà.');
}

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const recettesRoutes = require('./routes/recettes');
app.use("/api/auth", authRoutes);
app.use("/api/recettes", recettesRoutes);

// Dossier statique pour les fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connecté à MongoDB"))
.catch(err => console.error("❌ Erreurs MongoDB:", err.message));

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
