const mongoose = require("mongoose");

const addDropSchema = new mongoose.Schema({
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: () => Date.now() + 15 * 60 * 1000 },
  // set end date to 15 min in future
});

const AddDrop = mongoose.model("AddDrop", addDropSchema);

module.exports = AddDrop;
