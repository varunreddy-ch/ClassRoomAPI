const express = require('express')

const Class = require('../models/Class')
const Student = require('../models/Student')
const Tutor = require('../models/Tutor')

const classCtrl = {
    classes: async(req, res)=>{
        let classes = await Class.find({})
        return res.json({classes: classes})
    },
    createClass: async (req,res)=>{
        const user = req.user
    
        // Only tutor can create classroom
        if(user.role != 'tutor')   return res.status(400).json({msg: "Not tutor"})
    
        const classname = req.body.classname
    
        // Check whether classroom already exists
        let cl = await Class.findOne({name: classname})
        if( cl != null )    return res.status(400).json({msg: "Class already exists"})
        
        // Check whether the Tutor details are is present
        let tu = await Tutor.findOne({username: user.username})
        if( tu == null) return res.status(400).json({msg: "Username missing"})
    
        // Create classroom
        let data = await Class.create({name: classname, createdBy: tu._id})
        tu.classes.push(data._id)
        await tu.save()
        // await Tutor.findOneAndUpdate({username: user.username}, {classes: tu.classes}, {new: true})
        return res.json(data)
        
    },
    addStudent: async (req,res)=>{
        let user = req.user
        if(user.role != 'tutor') {
            return res.status(400).send("Access denied")
        }
    
        let classname = req.body.classname
        // console.log(req.body.student);
    
        let stud = await Student.findOne({username: req.body.student})
        // console.log(stud);
        // Student not present
        if( stud == null) {
            return res.status(403).send("Student not found")
        }
    
        let cl = await Class.findOne({name: classname})
    
        // Class not found
        if( cl == null)    {
            return res.status(403).send("Class not found")
        }
        let studlist = stud.classes
        if(! studlist.includes(cl._id)) {
            stud.classes.push(cl._id)
        }
        let cllist = cl.students
    
        if(! cllist.includes(stud._id)){
            cl.students.push(stud._id)
        }
        
        await stud.save()
        await cl.save()
    
    
        // let st = await Student.findOneAndUpdate({name: student}, {classes: stud.classes}, { new: true});
        // let cla = await Class.findOneAndUpdate({name: classname}, {students: cl.students}, { new: true});
        res.json({class: cl})
    },
    removeStudent: async (req,res)=>{
        let user = req.user
        if(user.role != 'tutor') {
            return res.status(400).send("Access denied")
        }
    
        let classname = req.body.classname
        let student = req.body.student
    
        let stud = await Student.findOne({username: student})
    
        // Student not present
        if( stud == null) {
            return res.status(403).send("Student not found")
        }
    
        let cl = await Class.findOne({name: classname})
    
        // Class not found
        if( cl == null)    {
            return res.status(403).send("Class not found")
        }
        stud.classes.remove(cl._id)
        cl.students.remove(stud._id)
    
    
        let st = await Student.findOneAndUpdate({name: student}, {classes: stud.classes}, { new: true});
        let cla = await Class.findOneAndUpdate({name: classname}, {students: cl.students}, { new: true});
        
    
        res.json({student: st, class: cla})
    }
}

module.exports = classCtrl