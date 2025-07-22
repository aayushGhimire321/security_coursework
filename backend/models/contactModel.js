// contact us model, having Name, email, subject, message,

const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

  subject: { type: String, required: true },
  message: { type: String, required: true },
});

const Contact = mongoose.model("contact", contactSchema);
module.exports = Contact;
