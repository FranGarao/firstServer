const express = require("express");
const router = express.Router();
const path = require("path");
const userController = require("../controllers/userControllers");
const { body } = require("express-validator");

router.get("/register", userController.getRegister);
router.post("/register", userController.register);

router.get("/login", userController.getLogin);
router.post("/login", userController.login);

router.get("/logout", userController.close);

module.exports = router;
