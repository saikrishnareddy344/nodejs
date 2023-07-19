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
        let user_details = await select_query(`select * from mobilserv.users where username = $1`,[username])
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
        let email = data.email
        let firstName = data.firstname
        let middleName = data.middlename
        let lastName = data.lastname
        let age = data.age
        let address = data.address
        let fullName = firstName+middleName+lastName
        console.log(Object.keys(data))
        let values = [firstName,lastName,middleName,age,address,hasedPassword,email]
        try {
            let query = `insert into user_data (first_name,last_name,middle_name,age,address,password,email) VALUES ($1, $2, $3, $4, $5, $6, $7)`
            let result = await insert_query(query,values)
            log.EventLog(`new user created sucessfully with username ${fullName}`)
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