const express = require("express");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 3001;
const mainRouter = require("./routes/mainRouter");
const productsRouter = require("./routes/productsRouter");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "./public")));

app.use("/", mainRouter);
app.use("/products", productsRouter);

app.listen(port, () => {
  console.log(`El puerto ${port} esta funcionando correctamente :)`);
});
