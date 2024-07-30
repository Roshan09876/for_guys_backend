const router = require("express").Router()
const busController = require("../controller/busController")

router.post("/create", busController.createBus)
router.post("/book/:userId/:busId", busController.bookBus)
router.get("/bookedbus/:userId", busController.getBookedBus)
router.get("/getallbus", busController.getAllBus)
router.get("/getbus/:id", busController.getBusbyId)
router.delete("/deleteBookedBus/:userId/:bookId", busController.deletebookedBus); 


module.exports = router