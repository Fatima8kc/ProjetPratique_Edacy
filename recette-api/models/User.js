const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  motdepasse: { type: String, required: true },
}, { timestamps: true });

// Hash du mot de passe avant sauvegarde
userSchema.pre("save", async function (next) {
  if (!this.isModified("motdepasse")) return next();
  this.motdepasse = await bcrypt.hash(this.motdepasse, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
