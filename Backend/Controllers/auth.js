const express = require("express");
const router = express.Router();
const User = require("../Model/auth");
const jwt = require('jsonwebtoken');
const { SECRETKEY } = require('../key');
const bcrypt = require("bcrypt");
const requireLogin = require('../middleware/requireLogin')


router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({
      errorMsg: "Please enter all details",
    });
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ errorMsg: "User already exists" });
      }

      bcrypt.hash(password, 10)
        .then((hashedPassword) => {
          const user = new User({
            name,
            email,
            password: hashedPassword,
          });

          user.save()
            .then(() => {
              res.status(200).json({ msg: "User added successfully" });
            })
           
        })
       
    })
   
});

router.post('/signin', (req, res)=>{
   const {email, password}= req.body

   if(!email || !password){
     res.status(422).json({
      errorMsg: "Please Enter All Deatils"
     });
    
   }
    User.findOne({email: email})
        .then(dbUser=>{
          //console.log(dbUser);

          if(!dbUser){
            return res.status(402).json({
               ErrorMessage: 'Not User exist for this email!!' 
              });
          }
          bcrypt.compare(password, dbUser.password)
                .then(()=>{
                    const token = jwt.sign({ id: dbUser._id }, SECRETKEY)
                    //console.log('Token :',token);

                    return res.status(200).json({ msg: "login successfully!!", token })
                })
          
        })
});


router.get('/protected', requireLogin, (req, res) => {
    res.status(200).json({ msg: "Access granted!!" })
});

module.exports = router;
