const Dev = require("../models/Dev");
const axios = require("axios");
const parseStringAsArray = require("../utils/parseStringAsArray");
const { findConnections, sendMessage } = require("../websocket");

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const techsArray = parseStringAsArray(techs);

      const response = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      const { name, avatar_url, bio } = response.data;

      // To save location
      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });

      // Filter conections there are 10km away
      console.log("im here find connections");
      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      );

      sendMessage(sendSocketMessageTo, "new-dev", dev);
    }

    return res.json(dev);
  },

  async update(req, res) {
    const { id } = req.params;

    let dev = await Dev.findOne({ _id: id });

    if (dev) {
      const { name, techs, bio, latitude, longitude } = req.body;
      const { filename } = req.file ? req.file : {};

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };

      dev = await dev.updateOne({
        name,
        avatar_url: filename ? filename : dev.avatar_url,
        bio: bio,
        techs: techsArray,
        location
      });
    }

    return res.json(dev);
  },

  async destroy(req, res) {
    const { id } = req.params;

    try {
      await Dev.deleteOne({ _id: id });
      return res.json({ message: "User deleted" });
    } catch (err) {
      return res.json(err);
    }
  }
};
