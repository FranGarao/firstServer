const path = require("path");
const fs = require("fs");
const { json } = require("stream/consumers");
const modelo = {
  fileRoute: path.join(__dirname, "../json/products.json"),
  //read all
  findAll: () => {
    const jsonData = fs.readFileSync(modelo.fileRoute);
    const products = JSON.parse(jsonData);
    return products;
  },
  filterByTitle: (title) => {
    const products = modelo.findAll();
    const selectedProducts = products.filter(
      (products) => products.title === title
    );
    return selectedProducts;
  },
  //read one
  findById: (id) => {
    const product = modelo.findAll();
    const selectedProduct = product.find((product) => product.id == id);

    return selectedProduct;
  },
  //create one
  createProduct: (bodyData) => {
    let products = modelo.findAll();
    const lastProdId = products[products.length - 1].id;
    const newProduct = { id: lastProdId + 1, ...bodyData };
    products.push(newProduct);
    const jsonData = JSON.stringify(products);
    fs.writeFileSync(modelo.fileRoute, jsonData, "utf-8");
    return newProduct;
  },
  //delete
  destroy: (id) => {
    let products = modelo.findAll();
    products = products.filter(
      (product) => parseFloat(product.id) !== parseFloat(id)
    );
    console.log(products);
    const jsonData = JSON.stringify(products);
    fs.writeFileSync(modelo.fileRoute, jsonData, "utf-8");
  },
  //update
  updateProduct: (updateProduct) => {
    //BUSCAR ARRAY DE PRODUCTOS YA EXISTENTES
    //CONSEGUIR EL INDICE DEL ARRAY EN EL QUE ESTA GUARDADO EL PRODUCTO
    //MODIFICAR EL ELEMENTO DEL ARRAY EN ESE INDICE POR EL QUE NOSP PASARON POR PARAMETRO
    //CONVERTIR ESTE NUEVO ARRAY EN JSON
    //GUARDAR TODO EN JSON
    let products = modelo.findAll();
    const prodIndex = products.findIndex(
      (product) => product.id === updateProduct.id
    );
    products[prodIndex] = updateProduct;

    const jsonData = JSON.stringify(products);
    fs.writeFileSync(modelo.fileRoute, jsonData, "utf-8");
  },
};

module.exports = modelo;
