const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/", authController.authenticate);
router.post("/signup", authController.register);

module.exports = router;