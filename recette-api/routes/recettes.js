const express = require("express");
const router = express.Router();
const Recette = require("../models/Recette");
const auth = require("../middlewares/auth");
const upload = require('../middlewares/upload');
const mongoose = require("mongoose");



// GET - voir toutes les recettes (publique)
router.get("/", async (req, res) => {
  const recettes = await Recette.find();
  res.json(recettes);
});

router.get('/mes-recettes', auth, async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Utilisateur non authentifié." });
  }

  try {
    const auteurId = new mongoose.Types.ObjectId(req.user.id); // conversion en ObjectId
    const recettes = await Recette.find({ auteur: auteurId }); // correspond au champ dans ta base

    res.json(recettes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des recettes." });
  }
});


// POST - ajouter une recette (authentifié)
router.post("/", auth, upload.single('image'), async (req, res) => {
  try {
    const nouvelleRecette = new Recette({
      titre: req.body.titre,
      ingredients: req.body.ingredients.split(',').map(i => i.trim()),
      etapes: req.body.etapes,
      temps: req.body.temps,
      categorie: req.body.categorie,
      auteur: req.user.id,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await nouvelleRecette.save();
    res.status(201).json(nouvelleRecette);
  } catch (err) {
    res.status(400).json({ message: err.message });
    if (!req.body.titre || !req.body.etapes || !req.body.temps || !req.body.categorie) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }
    
  }
});

// PUT - modifier une recette (auth + auteur)
router.put("/:id", auth, async (req, res) => {
  const recette = await Recette.findById(req.params.id);
  if (!recette) return res.status(404).json({ message: "Recette non trouvée." });
  if (recette.auteur.toString() !== req.user.id) {
    return res.status(403).json({ message: "Non autorisé." });
  }

  Object.assign(recette, req.body);
  await recette.save();
  res.json(recette);
});

// DELETE - supprimer une recette (auth + auteur)
router.delete("/:id", auth, async (req, res) => {
  const recette = await Recette.findById(req.params.id);
  if (!recette) return res.status(404).json({ message: "Recette non trouvée." });
  if (recette.auteur.toString() !== req.user.id) {
    return res.status(403).json({ message: "Non autorisé." });
  }

  await recette.delete();
  res.json({ message: "Recette supprimée." });
});

module.exports = router;
