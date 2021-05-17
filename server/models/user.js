const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true,
      unique: true
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image"
      }
    ]
  }, {
    timestamps: true,
  })
const User = mongoose.model("User", UserSchema)
module.exports = User;
