const router = require("express").Router()
const userController = require("../controller/userController")

router.post("/signup", userController.signup)
router.post("/signin", userController.signin)
router.get("/profile/:id", userController.getProfile)

module.exports = router