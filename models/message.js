const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  message: { type: String, required: true, maxLength: 250 },
  publish_date: { type: Date, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
});

// Virtual for author's URL
MessageSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/messages/${this._id}`;
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);
