import express from "express";
import { check, validationResult } from 'express-validator';
import petService from "../services/petService.js";
import Pet from "../models/petModel.js";

const router = express.Router();

router.get("/pets", async (req, res) => {
    try {
        const pets = await petService.getAllPets();
        res.json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/pets",
    [
        check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
        check('tipo').not().isEmpty().withMessage('El tipo es requerido')
    ], 
    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ error : errors.array() })
        }
        try {
            const { nombre, tipo, superpoder } = req.body;
            const newPet = new Pet(null, nombre, tipo, superpoder);
            const addedPet = await petService.addPet(newPet);
            res.status(201).json(addedPet);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
});

router.put("/pets/:id", async (req, res) => {
    try {
        const updatedPet = await petService.updatePet(req.params.id, req.body);
        res.json(updatedPet);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.delete('/pets/:id', async (req, res) => {
    try {
        const result = await petService.deletePet(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router; 