const express = require('express');
const app = express();
const { default: mongoose } = require('mongoose');
const {MONGOURI} = require('./key')


const PORT = process.env.PORT ||  3000

app.use(express.json());


app.use(express.urlencoded({extended : true}));

app.get('/api/health',(req, res)=>{
    console.log('Received GET request');
    res.send("Everything is working fine 🚀.");
});

mongoose.connect(MONGOURI)
   .then(() => console.log('Database connected successfully!!'));


app.use(require('./Controllers/auth'));
app.use(require('./Controllers/post'));



app.listen(PORT, ()=>{
   console.log(`Server runing on post http://localhost:${PORT}`)
});