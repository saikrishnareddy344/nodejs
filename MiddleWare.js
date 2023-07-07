const jwt = require('jsonwebtoken');
const multer = require('multer')

class MiddleWare{
    constructor(){

    }
    jwt_required(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
          return res.sendStatus(401); // Unauthorized
        }
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
          if (err) {
            return res.sendStatus(403); // Forbidden
          }
          console.log("jwt user =",user)
          req.user = user;
          next();
        });
      }
      file_upload(field_name){
        const storage = multer.diskStorage({
          destination: (req, file, cb) => {
            cb(null, './images'); // Specify the upload directory
          },
          filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
          },
        });
        
        // Create the multer upload instance
        return multer({ storage: storage }).single(field_name);
      }
}
module.exports = MiddleWare