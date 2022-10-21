const express = require("express")
const router = express.Router()
require("dotenv").config()
// const bodyParser = require("body-parser")
// express().use(bodyParser())
const authentication = require('../../middleware/authentication')
const filefeedCtrl = require('../../controllers/filefeedCtrl')

router.get("/file-feed", authentication, filefeedCtrl.fileFeed)
module.exports = router
