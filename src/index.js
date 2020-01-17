const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const routes = require("./routes");

const path = require("path");
const dotenv = require("dotenv");
const { setupWebSocket } = require("./websocket");

dotenv.config();
const app = express();
const server = http.Server(app);
setupWebSocket(server);

mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
  })
  .then(() => console.log("Database connected successfully!"));

app.use(cors());
app.use(express.json());
app.use("/files", express.static(path.resolve(__dirname, "..", "uploads")));
app.use(routes);
server.listen(process.env.PORT || 3333);
