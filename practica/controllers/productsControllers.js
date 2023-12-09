const path = require("path");
const modelo = require("../models/productModels");
const { validationResult } = require("express-validator");
const controller = {
  productsList: (req, res) => {
    const products = modelo.findAll();

    res.render("productsList", { products, user: req.session.user });
  },
  productDetail: (req, res) => {
    const productId = req.params.id;
    const selectedProduct = modelo.findById(productId);

    // console.log("ID del producto:", productId); // Verifica el ID del producto recibido
    // console.log("Producto seleccionado en controlador:", selectedProduct);
    res.render("productDetail", { products: selectedProduct });
  },
  getCreate: (req, res) => {
    // console.log(req.query);
    res.render("createProduct", { errors: req.query });
  },
  postProduct: (req, res) => {
    //para pbetener los resultados de la validacion le pasamos req como param a validationResult y este nos retorna el array de errores
    const result = validationResult(req);

    //chequeamos si hay errores. Si hay lo redireccionamos al form de creacion
    //y le agregamos el quierystring para que el middleware de autenticacion no nos prohiba entrar a la ruta
    if (result.errors.length > 0) {
      //armo un array de cada dato del querystring
      const queryArray = result.errors.map(
        (error) => `& ${error.path} = ${error.msg}`
      );
      //lo unimos y generamos un gran string
      const quieryString = queryArray.join("");
      // console.log(quieryString);
      //redireccionamos a la ruta de creacion del producto con los datos de los errroes
      res.redirect("/products/create?userType=admin" + quieryString);
      return;
    }

    const newProduct = {
      title: req.body.title,
      price: req.body.price,
      img: req.files[0].filename,
    };
    const createdProduct = modelo.createProduct(newProduct);
    // console.log(`El nuevo producto tiene el id: ${createdProduct.id}`);

    res.redirect("/products/" + createdProduct.id + "/detail");
  },
  getEdit: (req, res) => {
    const product = modelo.findById(Number(req.params.id));
    res.render("productEdit", { product });
  },
  deleteProduct: (req, res) => {
    modelo.destroy(req.params.id);

    res.redirect("/products");
  },
  updateProduct: (req, res) => {
    let updateProduct = {
      id: Number(req.params.id),
      ...req.body,
    };
    modelo.updateProduct(updateProduct);
    res.redirect("/products/" + updateProduct.id + "/detail");
  },
  filterProducts: (req, res) => {
    const products = modelo.findAll;
    const productsSelected = modelo.filterByTitle(
      (products.title = "Lavadora")
    );
    res.send(productsSelected);
  },
};
module.exports = controller;
