const ingredientsModel = require("../models/ingredientsModel")
const ingredientsRouter = require("express").Router() 
                                                 


ingredientsRouter.get("/ingredients", async (req, res) => {
    try {
        let ingredient = await ingredientsModel.find(req.query)
        res.send(ingredient)
    } catch (error) {
        res.send(error) 

    }
})

ingredientsRouter.get("/ingredients/:id", async (req, res) => {
    try {

        let ingredient = await ingredientsModel.findOne({ _id: req.params.id }, req.body)
        res.send(ingredient)
    } catch (error) {
        res.send(error) 

    }
})


ingredientsRouter.post("/ingredients", async (req, res) => {
    try {
        let newIngredients = new ingredientsModel(req.body)
        newIngredients.save()
        res.send("l'ingredient' à bien été ajouté")
    } catch (error) {
        res.send(error)
    }
})


ingredientsRouter.delete("/ingredients/:id",async(req, res) => {
    try{
        await ingredientsModel.deleteOne({_id: req.params.id})
        res.send("ingredient supprimer")
    }catch (error){
        res.send(error)
    }
})


module.exports = ingredientsRouter 