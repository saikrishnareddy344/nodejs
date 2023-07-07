const express = require('express');
const MyMethods = require('./Methods')
const MiddleWare = require('./MiddleWare')
const Log = require('./Logs')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors(),express.json())
const middleware = new MiddleWare()
const mymethods = new MyMethods()
const log = new Log('index')

app.get("/login", (req, res) => {
    let params = req.query
    let user_verification = mymethods.userVerification(params.username,params.password)
    log.EventLog(`login api got called username-->>${params.username} and password-->> ${params.password}`)
    if (user_verification) {
        let token = mymethods.generate_token(params.username,params.password)
        res.send({status:true,message:token})
    }
    else{
        res.send({status:false,message:"abbhu nahi manenge"})
    }
});

app.post("/form",middleware.jwt_required,middleware.file_upload('profile'), (req, res) => {
    console.log("protected calling sucessfully",req.file,req.body)
    res.send("photo reseceved")
});

let PORT = process.env.PORT;
app.listen(PORT,"192.168.2.61", () => {
console.log(`Server is up and running on ${PORT} ...`);
});
