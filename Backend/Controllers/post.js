const express = require('express');
const router = express.Router();
const Post = require('../Model/post');
const requireLogin = require('../middleware/requireLogin');

router.post('/createPost',requireLogin, (req, res)=>{
    const { title, body, pic } = req.body;
      if (!title || !body || !pic) {
        return res.status(422).json({
            errorMsg: 'Please fill all the details'
        });
    }
    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy : req.user,
    });
    post.save()
       .then(()=>{
        //  console.log(data);
          res.status(201).json({
            msg:'posted created successfully!!'
           });
       });

});

router.get('/allPost', requireLogin,(req, res)=>{
    Post.find()
        .then(posts=>{
            // console.log(posts)

            res.status(200).json({posts})
        })
})



module.exports = router