const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Inscription
router.post('/register', async (req, res) => {
  const { email, motdepasse } = req.body;
  try {
    const user = new User({ email, motdepasse }); // PAS DE hash ici
    await user.save();
    res.status(201).json({ message: "Utilisateur créé avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'inscription." });
  }
});

// Connexion
router.post("/login", async (req, res) => {
  const { email, motdepasse } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    const isMatch = await bcrypt.compare(motdepasse, user.motdepasse);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect." });

    const token = jwt.sign({ id: user.id }, "secret123", { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
