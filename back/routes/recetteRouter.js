const recetteModel = require("../models/recetteModel")
const recetteRouter = require("express").Router() 
                                                 


recetteRouter.get("/recettes", async (req, res) => {
    try {
        let recette = await recetteModel.find(req.query).populate({path:"ingredients"})
        res.send(recette)
    } catch (error) {
        res.send(error) 

    }
})

recetteRouter.get("/recettes/:id", async (req, res) => {
    try {

        let recette = await recetteModel.findOne({ _id: req.params.id }, req.body).populate({path:"ingredients"})
        res.send(recette)
    } catch (error) {
        res.send(error) 

    }
})


recetteRouter.post("/recettes", async (req, res) => {
    try {
        let newRecette = new recetteModel(req.body)
       await newRecette.save()
        res.send("la recette à bien été ajouté")
    } catch (error) {
        res.send(error)
    }
})

recetteRouter.put("/recettes/:id", async (req, res) => {
    try {
        await recetteModel.updateOne({ _id: req.params.id }, req.body)
        res.send("recette modifié")
    } catch (error) {
        res.send(error)
    }
})

recetteRouter.delete("/recettes/:id",async(req, res) => {
    try{
        await recetteModel.deleteOne({_id: req.params.id})
        res.send("recette supprimer")
    }catch (error){
        res.send(error)
    }
})


module.exports = recetteRouter 