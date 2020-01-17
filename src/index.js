require("dotenv/config");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const routes = require("../src/routes");
const { setupWebsocket } = require("./websocket");

const app = express();

const server = http.server(app);
setupWebsocket(server);
mongoose.connect(
  "mongodb+srv://antoniojr0007:arucard9@cluster0-kfnmo.mongodb.net/radardev?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }
);
app.use(cors());
app.use(express.json());
app.use(routes);
server.listen(process.env.PORT || 3333);
