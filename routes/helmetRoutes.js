const router = require("express").Router()
const helmetController = require("../controller/helmetController")

router.post("/create", helmetController.createHelmet)
router.post("/book/:userId/:helmetId", helmetController.bookHelmet)
router.get("/bookedHelmet/:userId", helmetController.getBookedHelmet)
router.get("/getallHelmet", helmetController.getAllHelmet)
router.delete("/deleteBookedhelmet/:userId/:bookId", helmetController.deletebookedHelmet)


module.exports = router