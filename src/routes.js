const routes = require("express").Router();

const multer = require("multer");
const uploadConfig = require("./config/upload");

const upload = multer(uploadConfig);

// Controllers
const DevController = require("./controllers/DevController");
const SearchController = require("./controllers/SearchController");

routes.get("/devs", DevController.index);
routes.post("/devs", DevController.store);
routes.delete("/devs/:id", DevController.destroy);
routes.put("/devs/:id", upload.single("avatar"), DevController.update);

routes.get("/search", SearchController.index);

module.exports = routes;
