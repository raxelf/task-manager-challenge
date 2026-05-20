const AuthController = require("../controllers/AuthController");
const auth = require("../middlewares/auth");

const express = require("express");

const router = express.Router();

// auth
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// protected routes (must logged in)
router.use(auth); // middlewares

// TODO: task (CRUD)

module.exports = router;
