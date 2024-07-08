const express = require('express')
const router = express.Router()
const {getTranslation,addTranslation,updateTranslation,deleteTransaltion} = require('../controlers/dictionaryControlers')


router.get("/find/:word", getTranslation)

router.post("/add",addTranslation)

router.put("/update/:word",updateTranslation)

router.delete("/delete/:word",deleteTransaltion)

module.exports = router