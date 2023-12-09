const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const productsController = require("../controllers/productsControllers");
const authMiddleware = require("../middlewares/authMiddlewares");
const { body } = require("express-validator");
//ES UN ARRAY DE MIDDLEWARES, pasar esto a carpeta middlewares
const validations = [
  //CHEQUEAMOS QUE EN EL BODY EL DATO TITLE NO ESTE VACIO
  body("title")
    .notEmpty()
    .withMessage("El campo esta vacio")
    .isString()
    .withMessage("El campo ingresado debe ser un texto")
    .not()
    .isNumeric()
    .withMessage("El campo no puede ser un número"),
  //CHEQUEAMOS QUE EN EL BODY EL DATO PRICE NO ESTE VACIO Y SEA NUMERICO
  body("price")
    .notEmpty()
    .withMessage("El campo ingresado esta vacio")
    .isInt()
    .withMessage("El campo ingresado debe ser un numero"),
];
//PASOS PARA APLICAR MULTER
// 1- CREAMOS UN STORAGE DE MULTER
// 2- SETEAMOS EL DESTINATION Y EL FILENAME (DONDE SE GUARDA LA IMG, Y CON QUE NOMBRE)
// 3- INICIALIZAMOS MULTER MPASANDOLE EL STORAGE QUE CREAMOS
// 4- PASAMOS ESTE MULTER COMO SEGUNDO PARAMETRO EN EL ROUTER.POST
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //La ruta se pasa como si estuvieramos desde el app.js
    //le indicamos donde va a guardar las imagenes
    cb(null, path.join(__dirname, "../public/images/products"));
  },
  //le indicamos que nombre van a tener las imagenes
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* GET users listing. */
router.get("/", productsController.productsList);
router.get("/filter", productsController.filterProducts);
//GET /products/:id/detail
router.get("/:id/detail", productsController.productDetail);
//GET
router.get("/create", authMiddleware.checkAdmin, productsController.getCreate);
router.get("/:id/edit", productsController.getEdit);

//POST/ Desde los post no renderizamos vistas, solo redirect
router.post(
  "/",
  //ACA LE INDICAMOS A MULTER QUE LA IMAGEN ESTA SUBIDA EN EL INPUT CON NOMBRE IMG
  //SI SUBIMOS 1 IMG = SINGLE, SINO ANY, IMPORTANTE PONER req.files en vez de req.file
  [
    upload.any("img"),
    //  authMiddleware.checkAdmin,
    ...validations,
  ],
  productsController.postProduct
);
//DELETE
router.delete("/:id/delete", productsController.deleteProduct);
//PUT
router.put("/:id/edit", productsController.updateProduct);

module.exports = router;
