const jwt = require("jsonwebtoken");
const { SECRETKEY } = require("../key");
const User = require("../Model/auth");

module.exports = (req, res, next) => {

  const {authorization} = req.headers;

  if(!authorization){
    return res.status(401).json({
      errormessage: "Please login first!!"
    });
  }

  const token = authorization.replace("Bearer ", "")
  //console.log(token);

  jwt.verify(token, SECRETKEY, (err, payload) => {
     if(err){
      return res.status(401).json({errormessage:"Invalid token. Please login again!"});
     }
     const {id} = payload;

     User.findById(id)
        .then(savedUser=>{
          if(!savedUser){
            return res.status(404).json({
              errormessage: "User Not Found!"
            })
          }
          //console.log(savedUser);
          
          req.user = savedUser
          next();
        });
  });
  
};
