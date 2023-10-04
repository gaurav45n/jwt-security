require("dotenv").config();
require("./config/db.config").connect();
const express = require("express");
const cors=require('cors');
const userRouter=require('./routes/user.routes')
const app = express();

app.use(express.json());


app.use(cors());
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
    next(); 
})

app.use('/api/user',userRouter);
// Logic goes here

module.exports = app;