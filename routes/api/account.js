const express = require("express")
const router = express.Router()
const accountCtrl = require("../../controllers/accountCtrl")

// API for creating student, given username(if exists return) and password
router.post("/create-student", accountCtrl.createStudent)

// API for getting all the students info
router.get("/students", accountCtrl.students)

// API for creating tutor, given username(if exists return) and password
router.post("/create-tutor", accountCtrl.createTutor)

// API for getting list of all the tutors
router.get("/tutors", accountCtrl.tutors)

// Student authentication
router.post('/student-login', accountCtrl.studentLogin)


// Tutor authentication
router.post('/tutor-login', accountCtrl.tutorLogin)

module.exports = router