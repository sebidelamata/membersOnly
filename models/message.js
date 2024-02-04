const mongoose = require("mongoose");
const { DateTime } = require("luxon");


const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  message: { type: String, required: true, maxLength: 250 },
  publish_date: { type: Date, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
});

// Virtual for author's URL
MessageSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/messages/message/${this._id}`;
});

MessageSchema.virtual("publish_date_formatted").get(function () {
  // We don't use an arrow function as we'll need the this object
  return DateTime.fromJSDate(this.publish_date).toLocaleString(DateTime.DATE_MED);
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);
