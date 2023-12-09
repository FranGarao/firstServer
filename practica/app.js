//requires e inicializaciones
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 3001;
const mainRouter = require("./routes/mainRouter");
const productsRouter = require("./routes/productsRouter");
const userRouter = require("./routes/userRouter");
const session = require("express-session");
const cookies = require("cookie-parser");
// app.set
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

//middleware de aplicacion(se ejecuta en toda la app(sin next))
// app.use((req, res, next) => {
//   console.log(req.query.user);
//   if (req.query.user === "admin") {
//     next();
//   } else {
//     res.send("No puedes acceder");
//   }
// });

app.use((req, res, next) => {
  const route = req.path + "\n";
  if (req.path === "/favicon.ico") return;
  // console.log(route);
  fs.appendFileSync(path.join(__dirname, "./json/routeInfo.txt"), route);
  next();
});

app.use(
  session({
    secret: "!!ggiiuullii  ttee  aammoo  mmuucchhoo!!",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use((req, res, next) => {
  if (req.cookies && req.cookies.email) {
    const userModel = require("./models/userModels");
    //mediante el modelo vamos a buscar los datos del usuario
    const user = userModel.findByEmail(req.cookies.email);
    //guardamos en session los datos del mismo
    req.session.user = user;
  }

  //para cerrar session: res.clearCookie('email")

  //si no hay cookie de email, no hacemos nada
  next();
});
// middlewares de router
app.use("/", mainRouter);
app.use("/products", productsRouter);
app.use("/user", userRouter);
app.use((req, res) => {
  res.render("404");
});
app.listen(port, () => {
  console.log(`El puerto ${port} esta funcionando correctamente :)`);
});
