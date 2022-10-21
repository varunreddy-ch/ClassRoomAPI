const express = require('express')
const authentication = require('../../middleware/authentication')
const router = express.Router()

const classCtrl = require('../../controllers/classCtrl')

// Get all class inforamtion
router.get('/classes', classCtrl.classes)

// Create a class
router.post("/create-classroom" ,authentication, classCtrl.createClass)

// Add student into classroom( add stud id into class.students and add class id into student.classes)
router.post("/add-student" ,authentication, classCtrl.addStudent)
// Remove student from a class
router.post("/remove-student" ,authentication, classCtrl.removeStudent)


module.exports = router