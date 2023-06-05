const express = require("express")
require("dotenv").config()


const File = require("../models/File")
const Tutor = require("../models/Tutor")
const Class = require("../models/Class")

const filefeedCtrl = { 
    fileFeed: async (req, res) => {
        let userinfo;
      
        // Check whether classroom exists
        let cl = await Class.findOne({name: req.body.classname})
        if(cl == null)  res.status(404).send("Classroom not found")
        
        // Check if the user is tutor or student
        if(req.user.role == 'tutor') {
          userinfo = await Tutor.findOne({username: req.user.username})
          if( !cl.createdBy.equals(userinfo._id)) return res.send("Access Denied") 
        }
        else {
          userinfo = await Student.findOne({username: req.user.username})
          if(!cl.students.includes(userinfo._id)) return res.send("Access Denied")
        }
      
        // Return file, if filename is given
        // console.log(req.body.filename);
        if( req.body.filename != null && req.body.filename != '' ) {
          let fileinfo = await File.findOne({name: req.body.filename})
          if( fileinfo == null) return res.sned("File not found")
          if(cl.files.includes(fileinfo._id)) return res.json({files: fileinfo})
          else  return res.send("FIle not found")
        }
      
        // Return all the files of given type
        else if( req.body.type != null && req.body.type != '') {
          let files = cl.files
      
          let allFiles = []
          await Promise.all(files.map(async (element) => {
            let tempfile = await File.findById(element);
      
            if( tempfile!= null && tempfile.type == req.body.type)  allFiles.push(tempfile)
          }))
      
          return res.json({files: allFiles})
      
        }
      
        // Else return all files in a class
        let files = cl.files
      
        let allFiles = []
        await Promise.all(files.map(async (element) => {
          let tempfile = await File.findById(element);
          if(tempfile != null)  allFiles.push(tempfile)
        }))
      
        return res.json({files: allFiles})
      }
}

module.exports = filefeedCtrl