const express = require("express")
const multer = require("multer")
const router = express.Router()
const path = require("path")
const fs = require('fs')
require("dotenv").config()
// const bodyParser = require('body-parser')
// express().use(bodyParser())


const File = require("../models/File")
const Tutor = require("../models/Tutor")
const Class = require("../models/Class")

const storage = multer.diskStorage({ 
  destination: (req, file, cb)=>{
    cb(null, 'temp')
  },
  filename: (req, file, cb)=>{
    req.path = Date.now() + path.extname(file.originalname)
    cb(null, req.path)
  }
})

// Credentials of the GCP, google drive API
// credentials = process.env.credentials

// Generally this confidential details should be stored in .env file( due to time constraint let it be here)
credentials = {
  "type": "service_account",
  "project_id": "toddle-classroom",
  "private_key_id": "03791bd008b6e6d6226eda64232d501b0effb30a",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDdCzjQYx71va6t\nV3F/8MZXDygQtjFvnfad4b+bcvGNq5JEqKp2aMgUxwO1CEQx6iS58xUQaw2x5bVS\nlYK+PIJGHrGIpw939RiFbu5g5K5kfMRpxpQ8T7LzSev0J0mTYhH9O4vWf3MzIAF2\n+vOfnHTb1PwmJLViSx4rI5M9hDiOdHGo3XWegMV2XB9bl0dfO5Wa1Wf7pixRkXzA\nYhFEDaVkB5bfippee9cQctD2gYIgn4UekKH9vTG/F6qhdvuwQLcmdpqq1HwVbTIj\nqH3ETaM+kaDJh9z6SpfVYk951n4gtjYu+B/t9klmDBb9R2oTySyXL9Bz2Ez1k2Yo\ne238rwY9AgMBAAECggEAETIZ9bQlqMOx1BBVEbk/D29sFCi9ncucb4SBWGwlDdAG\nwp/wauJp4PE+gOsnYE6xFA+CAv32WcbfR+Zo/mL3Vicgc9td4QdzJJDlqyn/Gxgj\nBiuJmqDZ8K0+gDGSOrdKuPgp6mzjHwYNYcknV10KMOktGHaLRHNINzOUSm5/y9fE\nIFGpvAyEZlow2rxLcblocWmY1AHAnRjPI38lqFG7OlaQdXyo9/alIP9SJ9FLkLHc\nseb9OaXsr1UmMYrXSStMBAQele4aIQ6p32PES1v4SR7RVfGNrvWG5cLXsw03zB+X\n56HvQJuuK9BlENdRixvj8kAPcJP+ud9Zuudpx6b3AQKBgQD5ull7FBb1Tnw/9rUG\nysMhEHbmvaOHfogE7aDeiYKt8825s1XAKeDHw7MS2Id/m1kV6BFWOPFPv6FnZj4g\nsmFM5QkW1EpcDjTuOo2ReFvqawL2ktH75dcFPCUKxxWDgrNLsDyRGEXsEUACEy1k\nVgNEFBR+vM6of0gIPOe4Rahh/QKBgQDimHH3aJL/kBpK+Du0hQd8SEEI5x0THYOs\nZal9eL61Sc6jEwKzYG1YU6OVHrlRIxrhcP5xv2H3yz/SljSUSsCTR7slkeotumv8\n1yn4G2RojIBdatYq94kFRPqlkD7JG3kH9Vv+HKA1DYAiCqMEKcq1ihX+2Vx2Ba5B\nVid3swFJQQKBgQDvt8A5c1ludL60r9+p+21ACgv5BsU5RW7QPEMWG64DyWsL/Wgt\nJIYPfH4jcxLunXLwomox+Es8IFmRZgXxYQohxCHrdjFDGKganr5Si9S/u6WGh/1l\n7oVvEwMDy4ONUCNIXo5lQYWtTAnDdCE4lZBhA12BI0DFYhkFP2G387XlCQKBgQCN\nqx3lvv3YxjGKGbTKYjmR3GK8vDITV2qRiGX1Sl6BXYnRrvsLRwhWJsSpYLIgJkCS\nHmEWoL8Re4OFl997r1jDPB+nl5i/ykPlqmhU9FtMejtvLHKGHokOQFgs1whKF+EN\ntrszHpaTVMN9hQTyf2Z7JcAmu6LxLxAJTWITllkBgQKBgQDVTa7OMQbEP5iGONmB\njVT6ruZqjgngBpJCN9CfM5hkS3vZebGVVMvilUQBVRcyN8hfqgd65yYbLftN4C8N\nPrkPymfJhNUbnNDKT5len6K2gEtiSDBNwMIJEb5MlrTfShnaGwrRONI4IFtGnu0F\nsFkaRKmgGdej/GhIQRsNiJwWFw==\n-----END PRIVATE KEY-----\n",
  "client_email": "toddleclassroom@toddle-classroom.iam.gserviceaccount.com",
  "client_id": "101927573854364984745",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/toddleclassroom%40toddle-classroom.iam.gserviceaccount.com"
}

const google = require("googleapis")

// For authentication
const authenticateGoogle = () => {
  const auth = new google.Auth.GoogleAuth({
    credentials: credentials,
    // keyFile: `${__dirname}/service-account-key-file.json`,
    scopes: "https://www.googleapis.com/auth/drive",
  });
  return auth;
};

// Uploading file to the google drive, in specified folder
const uploadToGoogleDrive = async (file, auth) => {
    const fileMetadata = {
      name: file.originalname,
      parents: ["1UUl2Qi0LqNDyyKyzjMPRyLRi25yeCX1h"], // Change it according to your desired parent folder id
    };
  
    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    };
    
    const driveService = new google.drive_v3.Drive({auth});
    
  
    const data = await driveService.files.create({
      media: media,
      requestBody: fileMetadata,
      fields: 'id,name',
    });
    
    console.log(`Uploaded file`);
    return data;
  };


  // Deleting locally saved file
  const deleteFile = (filePath) => {
    fs.unlink(filePath, () => {
      console.log("file deleted");
    });
  };

const fileCtrl = {
    deleteFile: async(req, res)=>{
        if(req.user.role == 'student')  return res.send("Access Denied")
        let file = await File.findOne({name: req.body.filename})
    
        if( !file ) return res.send("File not found")
    
        await File.findOneAndDelete({name: req.body.filename})
    
        await Promise.all(classes.map(async (element) => {
            element.files.remove(file._id)
            element.save()
        }))
    
        return res.send("File deleted successfully")
    },
    files: async(req, res)=>{
        let files = await File.find({})
        return res.json({files: files})
    },
    uploadFile: async (req, res) => {
        try {
          if (!req.file) {
            res.status(400).send("No file uploaded.");
            return;
          }
          // console.log(req.body);
          const auth = authenticateGoogle();
          
          const response = await uploadToGoogleDrive(req.file, auth); 
          // console.log("completed")
    
          let ty = response.data.name
          
          // console.log(req.path);
          // console.log(ty)
          ty = ty.split(".")[1]
          // console.log(ty)
          let tu = await Tutor.findOne({username: req.user.username})
          let fi = await File.create({url: response.data.id, 
                                  name: req.body.name,
                                  description: req.body.description,
                                  type: ty,
                                  uploadedBy: tu._id})
          deleteFile(req.path); 
          let cla = await Class.findOne({name: req.body.classname})
          cla.files.push(fi._id)
          await cla.save()
            // console.log(fi)
          return res.status(200).json({ fi });
        } catch (err) {
            console.log(err); 
        } finally {
            deleteFile(req.path); 
        }  
    },
    delete: async(req, res)=>{
        // console.log(req.body);
        let data = await File.findOneAndDelete({name: req.body.name})
      
        return res.send("Deleted Successfully")
    },
    modify: async (req, res) => {
        try{
          // Check if the user is tutor are not
          if( req.user.role != 'tutor')   return res.send("Access Denied")
      
          // Find file data
          let file = await File.findOne({name: req.body.filename})
          if(file == null)  return res.send("File not found")
      
          // Update the data for the fiven parameters
          if(req.body.newname)    file.name = req.body.newname
          if(req.body.desciption) file.description = req.body.desciption
          // Save the data into db
          await file.save()
          // return json object of saved file
          return res.json(file)
        }catch(err) {
          console.log(err);
        }
    }
}

module.exports = fileCtrl