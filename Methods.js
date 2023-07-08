let Log = require('./Logs')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const {select_query,insert_query} = require('./DBConnections')

let log = new Log('mymethods')

class MyMethods{
    constructor(){
        this.usernames = []
    }
    async userVerification(username,password){
        let hashedPassword = null
        let userId = null
        console.log(username,password)
        let user_details = await select_query(`select * from user_data where username = $1`,[username])
        console.log(user_details)
        if (user_details.length == 1) {
            hashedPassword = user_details[0].password
            userId = user_details[0].id
        } else {
            return {status:false,message:"user not found"}
        }
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (isMatch) {
            return {status:true,message:{username:username,userId:userId}}
        } else {
            return {status:false,message:"invalid password"}
        }
    }
    generateToken(username,userId){
        console.log(userId)
        let data = {
            time: Date(),
            userId: userId,
            username:username,
            }
	    return jwt.sign(data, process.env.JWT_SECRET_KEY,{expiresIn:process.env.TOKEN_TIME});
    }
    async usernameValidation(username){
        if (this.usernames.includes(username)) {
            return {status:false,message:"user already exists"}
        } else {
            return {status:true,message:"username valid"}
        }
    }
    async user_registration(data){
        let hasedPassword =  await bcrypt.hash(data.password, 10)
        console.log(Object.keys(data))
        let values = [data.username,hasedPassword,data.email]
        try {
            let result = await insert_query(`insert into user_data (username, password, email) VALUES ($1, $2, $3)`,values)
            log.EventLog(`new user created sucessfully with username ${data.username}`)
            if (result == true) {
                this.usernames.push(data.username)
                return {status:true,message:"new user created sucessfully"}
            } else {
                log.EventLog('---ERROR---',result)
                return {status:false,message:'unable to create new user'} 
            }
        } catch (error) {
            log.EventLog("---ERROR---",error)
            return {status:false,message:"unable to create new user"}
        }
    }
}

module.exports = MyMethods