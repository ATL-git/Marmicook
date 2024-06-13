const express = require("express") 
const mongoose = require("mongoose") 
const cors = require("cors");
require('dotenv').config()

const recetteRouter= require("./routes/recetteRouter")
const ingredientsRouter= require("./routes/ingredientsRouter")
const port = process.env.PORT
const db = process.env.DATABASE_URL
const app = express() 

app.use(cors())
app.use(express.json()) 
app.use(recetteRouter)
app.use(ingredientsRouter)

app.listen(port,(err)=>{
    if(err){
        console.log(err) ;
    }else{
        console.log(`connecté au serveur sur le port ${port}`) ;
        
    }
})

mongoose.set('strictQuery',true);


mongoose.connect(db)