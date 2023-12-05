const path = require("path");
const modelo = require("../models/productModels");
const controller = {
  productsList: (req, res) => {
    const products = modelo.findAll();
    res.render("productsList", { products });
  },
  productDetail: (req, res) => {
    const productId = req.params.id;
    const selectedProduct = modelo.findById(productId);

    console.log("ID del producto:", productId); // Verifica el ID del producto recibido
    console.log("Producto seleccionado en controlador:", selectedProduct);
    res.render("productDetail", { products: selectedProduct });
  },
  getCreate: (req, res) => {
    res.render("createProduct");
  },
  postProduct: (req, res) => {
    console.log(req.body);
    const newProduct = {
      title: req.body.title,
      price: req.body.price,
    };
    const createdProduct = modelo.createProduct(newProduct);
    console.log(`El nuevo producto tiene el id: ${createdProduct.id}`);

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
};
module.exports = controller;
