const mongoose = require("mongoose") ; 


    const ingredientsSchema = mongoose.Schema({
        nom: {
            type: String,
            required: [true, "L'ingrédient doit avoir un nom"]
        },
        quantite: {
            type: String,
            required: [true, "L'ingrédient doit avoir une quantité"]
        }
    });

const ingredientsModel = mongoose.model('ingredients',ingredientsSchema) 
module.exports = ingredientsModel  