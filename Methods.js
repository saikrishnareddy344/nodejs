let EventLog = require('./Logs')
const jwt = require('jsonwebtoken');
const {select_query} = require('./DBConnections')

class MyMethods{
    constructor(){
        this.first = 0 
    }
    userVerification(username,password){
        if (username=='saikrishna' && password == 'saikrishna') {
            return true
        } else {
            return false
        }
    }
    generate_token(username,password){
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = {
            time: Date(),
            userId: 12,
            username:username,
            password:password
            }
	    return jwt.sign(data, jwtSecretKey,{expiresIn:process.env.TOKEN_TIME});
    }
    username_validation(username){
        
    }
}

module.exports = MyMethods