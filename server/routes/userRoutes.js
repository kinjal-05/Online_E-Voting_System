const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");


router.post("/register", userController.register);
router.get("/by-email/:email", userController.getUserByEmail);

router.post("/login", userController.login);
router.get("/users/admins",userController.getAdmins);
router.delete("/voters/delete/:id",  userController.deleteUser);
module.exports = router; 