// Name: Gozlan
// ID: ___326232089____________

require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const connectDB = require("./services/mongoDB");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/", require("./routes/index"));

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`The server is running on port: ${PORT}`);
  });
};

startServer();
