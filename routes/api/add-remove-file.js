const express = require("express")
const router = express.Router()

const fileCtrl = require("../../controllers/fileCtrl")


const multer = require("multer")
const path = require("path")
const fs = require('fs')
require("dotenv").config()
// const bodyParser = require('body-parser')
// express().use(bodyParser())

const authentication = require('../../middleware/authentication')

const storage = multer.diskStorage({ 
  destination: (req, file, cb)=>{
    cb(null, 'temp')
  },
  filename: (req, file, cb)=>{
    req.path = Date.now() + path.extname(file.originalname)
    cb(null, req.path)
  }
})

const upload  = multer({storage: storage})

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

// Checking if the user is tutor( Only tutor can add/modify/remove files)
const verifyTutor = (req, res, next)=>{
  if(req.user.role != 'tutor')  return res.send("Access Denied")
  next()
}

// Deteting file, given file name as input
router.delete("/delete-file", authentication, fileCtrl.deleteFile)
// Get all files ( Debugging purpose)
router.get("/files", fileCtrl.files)

// Upload file
router.post("/upload-file", [authentication,verifyTutor, upload.single("Image")], fileCtrl.uploadFile)
// Delete a file
router.delete("/file", [authentication, verifyTutor], fileCtrl.delete)
// Modify a file
router.patch("/modify-file", authentication, fileCtrl.modify)
module.exports = router
//   const response = await drive.files.list(params);
