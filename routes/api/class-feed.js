const express = require('express')
const authentication = require('../../middleware/authentication')
const router = express.Router()

const classfeedCtrl = require('../../controllers/classfeedCtrl')


// Class feed API,
//  First check whether the user is student or tutor and get the information of the respective users classes
router.get("/class-feed" ,authentication, classfeedCtrl.classFeed)

module.exports = router