const mongoose = require('mongoose');  

const recetteSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    ingredients: [String],
    etapes: { type: String },
    temps: { type: String },
    categorie: { type: String },
    image: { type: String },
    auteur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model('Recette', recetteSchema);
