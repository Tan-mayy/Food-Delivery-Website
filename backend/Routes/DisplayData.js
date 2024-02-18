const express = require("express");
const router = express.Router();

router.post("/foodData", (req, res)=>{
    try {
        console.log(global.food_itms)
        res.send([global.food_itms, global.food_cater])
    } catch (error){
        console.error(error.message);
        res.send("Server Error")
    }
});
module.exports = router;