const model = require("../models/userModels");
const bcrypt = require("bcrypt");
const cookie = require("cookie-parser");
const controller = {
  getRegister: (req, res) => {
    const errors = req.query.error;
    res.render("register", { errors });
  },

  getLogin: (req, res) => {
    const errors = req.query.error;
    res.render("login", { errors });
  },
  register: (req, res) => {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    const user = model.create(newUser);
    if (user.error) {
      res.redirect("/user/register?error=" + user.error);
    } else {
      res.redirect("/user/login");
    }
  },

  login: (req, res) => {
    const userInJson = model.findByEmail(req.body.email);
    //caso de que el mail no este registrado
    if (!userInJson) {
      return res.redirect("/user/login?error=Email no registrado");
    }

    //aca deshasheamos la contrasenia y la comparamos con la ingresada
    console.log(req.body.password, userInJson.password);
    const validPw = bcrypt.compareSync(req.body.password, userInJson.password);
    if (validPw) {
      // es lo mismo que poner solo req.body.on (porque si es !== "on" seria undefinded)
      if (req.body.remember === "on") {
        //creamos una cookie, guardamos el id del usuario y hacemos que expire en un anio
        res.cookie("email", userInJson.email, {
          maxAge: 1000 * 60 * 60 * 24 * 365,
        });
      }

      req.session.user = userInJson;
      res.redirect("/products");
    } else {
      res.redirect("/user/login?error=Password incorrecta");
    }
  },
  close: (req, res, next) => {
    req.session.destroy((err) => {
      if (err) {
        console.log("Error al cerrar sesion:", err);
        res.sendStatus(500);
      } else {
        res.clearCookie("email");
        res.redirect("/products");
      }
    });
  },
};
module.exports = controller;
