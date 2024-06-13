const mongoose = require("mongoose") ; 


const recetteSchema = mongoose.Schema({
    titre : {
       type : String,
       required: [true, "la recette doit avoir un titre"]
    },
    ingredients:[{
       type: mongoose.Schema.Types.ObjectId, ref: 'ingredients',
        required:true
    }],
    instruction:{
        type:String,
        required:[true,"la recette doit avoir une instruction"]
    },
    tempsPrepa:{
        type:String,
        required:[true,"la recette doit avoir un temps de preparation"]
    },
    tempsCuisson:{
        type:String,
        required:[true,"la recette doit avoir un temps de cuisson"]
    },
    difficulte:{
        type:String,
        required:[true,"la recette doit avoir une difficulté"]
    },
    categorie:{
        type:String,
        required:[true,"la recette doit avoir une catégorie"]
    },
    
})


const recetteModel = mongoose.model('recettes',recetteSchema) 
module.exports = recetteModel