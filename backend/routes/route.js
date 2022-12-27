const express = require('express');
const router = express.Router();
const { signup, userLogin } = require("../controllers/userController");



//APIS for user
router.post("/register", signup);
router.post("/login", userLogin);

module.exports = router