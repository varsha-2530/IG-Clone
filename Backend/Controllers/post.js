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
});


router.get('/mypost',requireLogin, (req, res) => {
   Post.find({ postedBy: req.user._id })
       .then(data => {
          //console.log(data);
           res.json({ posts: data }); 
       })
      
});


router.put("/like",requireLogin,(req, res)=>{
   const {postId} = req.body
     Post.findByIdAndUpdate(postId,{
        $push :{likes: req.user._id}
     },{
        new:true,
     }
    
    )
    .then((data)=>{
        // console.log(data);
        res.json({data})
    })
    .catch(err=>console.log(err)
    )     
});

router.put("/Unlike",requireLogin,(req, res)=>{
   const {postId} = req.body
     Post.findByIdAndUpdate(postId,{
        $pull :{likes: req.user._id}
     },{
        new:true,
     }
    
    )
    .then((data)=>{
        // console.log(data);
        res.json({data})
    })
    .catch(err=>console.log(err)
    )     
});

router.put('/comment', requireLogin, (req, res)=>{
    const postcomment ={
        text: req.body.text,
        postedBy : req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comment: postcomment}
    },{
        new:true
    })
    .then(()=>{
       res.status(200).json({msg:"Comment Successfully"});
    })
});

router.put('/deletecomment', requireLogin, (req, res)=>{
    const postcomment ={
        text: req.body.text,
        postedBy : req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{comment: postcomment}
    },{
        new:true
    })
    .then(()=>{
       res.status(200).json({msg:"Comment delete Successfully"});
    })
});


router.delete("/deletepost/:postId", requireLogin, (req, res)=>{
     Post.findOne({_id : req.params.postId})
        .then((post)=>{
            console.log(post);
           
            if(post.postedBy._id.toString() === req.user._id.toString()){
                post.deleteOne()
                   .then(()=>{
                      return res.status(200).json({post})
                   })
            }
        });
});







module.exports = router