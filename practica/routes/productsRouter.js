const express = require("express");
const router = express.Router();
const multer = require("multer");
const productsController = require("../controllers/productsControllers");
//CREAMOS UN STORAGE DE MULTER
//SETEAMOS EL DESTINATION Y EL FILENAME (DONDE SE GUARDA LA IMG, Y CON QUE NOMBRE)
//INICIALIZAMOS MULTER MPASANDOLE EL STORAGE QUE CREAMOS
// PASAMOS ESTE MULTER COMO SEGUNDO PARAMETRO EN EL ROUTER.POST
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/products");
  },
  fileName: (req, file, cb) => {
    cb(null, "");
  },
});

const upload = multer({ storage });

/* GET users listing. */
router.get("/", productsController.productsList);
//GET /products/:id/detail
router.get("/:id/detail", productsController.productDetail);
//GET
router.get("/create", productsController.getCreate);
router.get("/:id/edit", productsController.getEdit);
//POST/ Desde los post no renderizamos vistas, solo redirect
//ACA LE INDICAMOS A MULTER QUE LA IMAGEN ESTA SUBIDA EN EL INPUT CON NOMBRE IMG
router.post("/", upload.single("img"), productsController.postProduct);
//DELETE
router.delete("/:id/delete", productsController.deleteProduct);
//PUT
router.put("/:id/edit", productsController.updateProduct);

module.exports = router;
