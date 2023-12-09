const middleware = {
  checkAdmin: (req, res, next) => {
    console.log("se ingreso a la ruta de creacion de producto");
    if (req.query.userType === "admin") {
      next();
    } else {
      res.redirect("/products");
    }
  },
};
module.exports = middleware;
