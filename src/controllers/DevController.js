const axios = require("axios");
const Dev = require("../models/Dev");
const str2array = require("./utils/str2array");

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();
    return res.json({ devs });
  },

  async create(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    const devExists = await Dev.findOne({ github_username });
    if (devExists) return res.json(devExists);

    const apiResponse = await axios.get(
      `https://api.github.com/users/${github_username}`
    );

    const { name = login, avatar_url, bio } = apiResponse.data;
    techsArray = str2array(techs);

    const location = {
      type: "Point",
      coordinates: [longitude, latitude]
    };

    const dev = await Dev.create({
      github_username,
      name,
      avatar_url,
      bio,
      techs: techsArray,
      location
    });

    return res.json(dev);
  },

  async read(req, res) {
    const { github_username } = req.params;
    const dev = await Dev.findOne({ github_username });

    return res.json(dev === null ? {} : dev);
  },

  async update(req, res) {
    const { github_username } = req.params;
    const dev = await Dev.findOne({ github_username });
    const { latitude, longitude, techs, ...rest } = req.body;
    rest.github_username = github_username;
    if (latitude && longitude)
      var newLocation = {
        type: "Point",
        coordinates: [longitude, latitude]
      };
    if (techs) var techsArray = str2array(techs);
    const newDev = await Dev.updateOne(
      { github_username },
      {
        location: latitude && longitude ? newLocation : dev.location,
        techs: techs ? techsArray : dev.techs,
        ...rest
      }
    );

    return res.json({
      modifiedCount: newDev.nModified,
      ok: newDev.ok
    });
  },

  async delete(req, res) {
    const { github_username } = req.params;
    await Dev.deleteOne({ github_username });
    return res.json();
  }
};
