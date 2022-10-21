const express = require("express")
const router = express.Router()

// Importing Schemas
const Student = require("../models/Student")
const Tutor = require("../models/Tutor")
const jwt = require("jsonwebtoken")

// const bcrypt = require('bcrypt');

// async function hashIt(password){
//   const salt = await bcrypt.genSalt(6);
//   const hashed = await bcrypt.hash(password, salt);
//   return hashed
// }
// // compare the password user entered with hashed pass.
// async function compareIt(password){
//   const validPassword = await bcrypt.compare(password, hashedPassword);
//   return validPassword
// }

// API for creating student, given username(if exists return) and password

const accountCtrl = {
    createStudent: async (req, res)=>{
    
        const username = req.body.username
        // const password = await hashIt(req.body.password)
        const password = req.body.password
    
        const check = await Student.find({username: username})
    
    
        if( check.length !== 0 )   return res.send("Username already exists")
        else {
            let data = await Student.create({username: username, 
                                            password: password})
    
            return res.status(201).json({ _id : data._id,
                                        username: username,
                                        classes: data.classes})
        }
    },
    students: async(req, res)=>{
        let students = await Student.find({})
        let data = []
        students.forEach(element => {
          data.push({ username: element.username, classes: element.classes});
        });
      
        return res.json({students: data})
    },
    createTutor: async (req, res)=>{
        const username = req.body.username
        // const password = await hashIt(req.body.password)
        const password = req.body.password
    
        const check = await Tutor.find({username: username})
    
        if( check.length !== 0 )   return res.status(400).send("Username already exists")
        else {
            
            let data = await Tutor.create({username: username, 
                                            password: password})
    
            return res.status(200).json({ _id : data._id,
                                            username: username,
                                        classes: data.classes})
        }
    },
    tutors: async(req, res)=>{
        let tutors = await Tutor.find({})
        let data = []
        tutors.forEach(element => {
          data.push({ username: element.username, classes: element.classes});
        });
      
        return res.json({tutors: data})
    },
    tutorLogin: async (req, res)=>{
        // Find the tutor
        const tutor = await Tutor.findOne({username: req.body.username})
    
        if ( tutor == null) return res.status(400).send('No tutor found')
    
        // let check = await bcrypt.compare(req.body.password, tutor.password)
        if( req.body.password != tutor.password ) return res.send("Incorrect password")
    
        let username = req.body.username; 
    
        let user = { 
            username: username,
            role: 'tutor'
        }
        // Return token after successful verification
        let token = jwt.sign(user, process.env.SECRET_KEY) 
        res.json({token: token})
    },
    studentLogin: async (req, res)=>{
        // Find the student
        const student = await Student.findOne({username: req.body.username})
    
        if ( student == null )  return res.status(400).send('No student found')
    
        // let check = await bcrypt.compare(req.body.password, student.password)
        if( req.body.password != student.password ) return res.send("Incorrect password")
    
        let user = {
            username: req.body.username, 
            role: 'student'
        }
    
        // Return token after successful verification
        let token = jwt.sign(user, process.env.SECRET_KEY)
        res.json({token: token})
    }
}

module.exports = accountCtrl