const mongoose = require("mongoose");
const PointSchema = require("./utils/PointSchema");

const DevSchema = new mongoose.Schema(
  {
    name: String,
    github_username: String,
    bio: String,
    avatar_url: String,
    techs: [String],
    location: {
      type: PointSchema,
      index: "2dsphere"
    }
  },
  {
    toJSON: {
      virtuals: true
    }
  }
);

DevSchema.virtual("photo_url").get(function() {
  if (!/(https:)/gm.test(this.avatar_url)) {
    return `http://192.168.100.77:3333/files/${this.avatar_url}`;
  }
});

module.exports = mongoose.model("Dev", DevSchema);
