const Class = require('../models/Class')
const Student = require('../models/Student')
const Tutor = require('../models/Tutor')

const classfeedCtrl = {
    classFeed: async (req,res)=>{

        // If the user is student
        let userinfo;
        if(req.user.role == 'student') {
            userinfo = await Student.findOne({username: req.user.username})
        }
        else {
            userinfo = await Tutor.findOne({username: req.user.username})
        }
    
        if( userinfo == null) return res.status(403).send("User not found")
        let list = []
    
        await Promise.all(userinfo.classes.map(async (element) => {
            let data = await Class.findById(element)
            list.push(data.name)
        }))
        res.json({classes: list})
    }
}

module.exports = classfeedCtrl