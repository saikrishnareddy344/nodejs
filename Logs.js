let fs = require('fs')
let fsPromise = require('fs').promises
let path = require('path')

class logs{
   constructor(filename){
      this.filename = filename
   }
   async EventLog(message){
      const date = new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'});
      const dateObject = new Date(date);
      const month = dateObject.getMonth();
      const year = dateObject.getFullYear();
      try {
         if (!fs.existsSync(path.join(__dirname,'logs'))) {
            await fsPromise.mkdir(path.join(__dirname,"logs"))
         }
         await fsPromise.appendFile(path.join(__dirname,"logs",`${this.filename}_${month}_${year}.txt`),`\n${date} -->> ${message}`)
      } catch (error) {
         console.log(error)
      }
   }
}

module.exports = logs


