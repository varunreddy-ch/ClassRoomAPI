require('dotenv').config()

const app = require('express')()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

// Import Routers
const account = require("./routes/api/account")
const addRemoveStudent = require("./routes/api/create-class-add-remove-student")
const classFeed = require("./routes/api/class-feed")
const addRemoveFile = require("./routes/api/add-remove-file")
const feedFile = require("./routes/api/file-feed")
// const modifyFile = require("./routes/api/modify-file")

let PORT = process.env.PORT || 3000 
 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect(process.env.URI, ()=>{   
    console.log("db connected");
}) 

app.use("/api", account)
app.use("/api", addRemoveStudent)
app.use("/api", classFeed)
app.use("/api", addRemoveFile)
app.use("/api", feedFile)


app.get('/', (req, res)=> { 
    res.send("Welcome to Class Files Application")  
})

app.listen(PORT, ()=>{ 
    console.log(`listening to ${PORT}`)
})   