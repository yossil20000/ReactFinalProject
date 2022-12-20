var mongoose = require('mongoose');
const { DateTime } = require('luxon');
const { body } = require('express-validator');

var Schema = mongoose.Schema;

const ImageSchema = new Schema({
  title: { type: String },
  author: { type: String },
  image: { type: String },
  public: { type: Boolean, default: false }
});

module.exports = mongoose.model("Image", ImageSchema);