const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");
const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    yearLevel: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // Year levels from 1 to 12
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
subjectSchema.index(
  { code: 1 },
  { unique: true, partialFilterExpression: { active: true } }
);
subjectSchema.index({ name: "text", description: "text" });
subjectSchema.plugin(mongoose_fuzzy_searching, {
  fields: ["name", "description"],
});
const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
