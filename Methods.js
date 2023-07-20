let Log = require('./Logs')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const {select_query,insert_query} = require('./DBConnections')

let log = new Log('mymethods')

class MyMethods{
    constructor(){
        this.usernames = []
        this.schema_name = 'maxeon'
    }
    async userVerification(username,password){
        let hashedPassword = null
        let userId = null
        console.log(username,password)
        let user_details = await select_query(`select * from ${this.schema_name}.users where username = $1`,[username])
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
    async sender_receiver_data(incomingdata){
        try{
        sender = incomingdata.sender_id,
        receiver = incomingdata.receiver_id,
        message = incomingdata.message
        const creation = currentDateTime.toLocaleString()
        let insert_value = [message,sender,receiver,creation]
        if(incomingdata.sender_id!=undefined){
            
            let sr_data = await select_query(`insert into ${this.schema_name}.messages(message,sender_id,receiver_id,creation_date) values($1, $2, $3, $4)`)
            let result = await insert_query(sr_data,insert_value)   
            log.EventLog(`inserted into messages table with message - ${message}`)
            if (result == true) {
                return {status:true,message:"new user created sucessfully"}
            } else {
                log.EventLog('---ERROR---',result)
                return {status:false,message:'unable to create new user'} 
            }
        
        }
    }catch(error){
        log.EventLog("---ERROR---",error)
        return {status:false,message:"unable to insert into messages table"}
    }
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
        let active = data.active
        let age = data.age
        // let address = data.address
        let username = firstName+middleName+lastName
        const creation = currentDateTime.toLocaleString()
        console.log(Object.keys(data))
        let values = [username,age,hasedPassword,email,active,creation]
        try {
            let query = `insert into ${this.schema_name}.users (username,age,password,email,active,creation_date) VALUES ($1, $2, $3, $4, $5,$6)`
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