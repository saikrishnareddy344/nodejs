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

app.post("/login", async (req, res) => {
    try {
        let params = req.body
        console.log(params)
        let user_verification =await mymethods.userVerification(params.name,params.password)
        console.log(user_verification)
        log.EventLog(`login api got called username-->>${params.username} and password-->> ${params.password}`)
        if (user_verification.status) {
            let token = mymethods.generateToken(params.username,user_verification.message.userId)
            res.send({status:true,message:token})
        }
        else{
            res.send({status:false,message:user_verification.message})
        }
    } catch (error) {
        res.send({
            status:false,
            message:error
        })
    }
});

app.post("/userRegestration",middleware.file_upload('profile'), async(req, res) => {
    console.log("prinitng user data",)
    try {
        console.log(req.file)
        let result= await mymethods.user_registration(req.body)
        res.json(result)
    } catch (error) {
        log.EventLog("---ERROR---",error)
        res.json({
            status:false,
            message:'unable to create new user'
        })
    }
});

app.get("/checkUsername",async (req,res)=>{
    try {
        let result = await mymethods.usernameValidation(req.query.username)
        res.json(result)
    } catch (error) {
        log.EventLog("---ERROR---",error)
        res.json({
            status:false,
            message:'unable to verify username'
        })
    }
})

app.get('/userDetails',middleware.jwt_required,async (req,res)=>{
    console.log(req.tokenData)
    res.send(req.tokenData)
})

let PORT = process.env.PORT;
app.listen(5005,"192.168.2.61", () => {
console.log(`Server is up and running on ${PORT} ...`);
});
