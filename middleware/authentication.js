const jwt = require('jsonwebtoken')

// Middleware function will verify the token and 
// extract the information present in the token
module.exports = function authenticateToken(req, res, next) {
    // Header will in the format of Bearer TOKEN
    let authHeader = req.headers["authorization"]
    let token = authHeader && authHeader.split(' ')[1]
    
    if(token == null)    return res.sendStatus(401)

    jwt.verify(token, process.env.SECRET_KEY, (err, user)=>{
        if(err) return res.status(401).send("Invalid token")
        req.user = user
    })
    next()
}  