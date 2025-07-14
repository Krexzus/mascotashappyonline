import express from "express";
import { check, validationResult } from 'express-validator';
import * as petService from "../services/petService.js";

const router = express.Router();

router.get("/pets", async (req, res) => {
    try {
        const pets = await petService.getAllPets();
        res.json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/pets", async (req, res) => {
    try {
        const pet = await petService.addPet(req.body);
        res.status(201).json(pet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/pets/:id", async (req, res) => {
    try {
        const pet = await petService.updatePet(req.params.id, req.body);
        res.json(pet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/pets/:id", async (req, res) => {
    try {
        await petService.deletePet(req.params.id);
        res.json({ message: "Mascota eliminada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Alimentar mascota
router.post("/pets/:id/feed", async (req, res) => {
    try {
        const pet = await petService.alimentarPet(req.params.id);
        res.json(pet);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Dar agua a la mascota (nueva función)
router.post("/pets/:id/water", async (req, res) => {
    try {
        const pet = await petService.darAguaPet(req.params.id);
        res.json(pet);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Sacar a pasear
router.post("/pets/:id/walk", async (req, res) => {
    try {
        const pet = await petService.pasearPet(req.params.id);
        res.json(pet);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Dormir mascota (nueva función)
router.post("/pets/:id/sleep", async (req, res) => {
    try {
        const pet = await petService.dormirPet(req.params.id);
        res.json(pet);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Hacer ejercicio (nueva función)
router.post("/pets/:id/exercise", async (req, res) => {
    try {
        const pet = await petService.hacerEjercicioPet(req.params.id);
        res.json(pet);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Personalizar mascota (agregar item)
router.post("/pets/:id/customize", async (req, res) => {
    try {
        const { item } = req.body;
        const pet = await petService.personalizarPet(req.params.id, item);
        res.json(pet);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Curar enfermedad
router.post("/pets/:id/cure", async (req, res) => {
    try {
        const { enfermedad } = req.body;
        const pet = await petService.curarPet(req.params.id, enfermedad);
        res.json(pet);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Obtener estado de la mascota
router.get("/pets/:id/status", async (req, res) => {
    try {
        const pet = await petService.getPetStatus(req.params.id);
        res.json(pet);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Obtener estado de todas las mascotas (nueva función)
router.get("/pets/status/all", async (req, res) => {
    try {
        const pets = await petService.getAllPetsStatus();
        res.json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Degradar estadísticas de una mascota específica (nueva función)
router.post("/pets/:id/degrade", async (req, res) => {
    try {
        const pet = await petService.degradarEstadisticasTiempo(req.params.id);
        res.json(pet);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Degradar estadísticas forzada (para pruebas)
router.post("/pets/:id/degrade/force", async (req, res) => {
    try {
        const { horas = 1 } = req.body;
        const pet = await petService.degradarEstadisticasForzada(req.params.id, horas);
        res.json(pet);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Forzar recálculo de personalidad (para debugging)
router.post("/pets/:id/personality/recalculate", async (req, res) => {
    try {
        const pet = await petService.forzarRecalculoPersonalidad(req.params.id);
        res.json(pet);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Obtener información de peso (para debugging)
router.get("/pets/:id/weight", async (req, res) => {
    try {
        const info = await petService.getPetWeightInfo(req.params.id);
        res.json(info);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Forzar aumento de peso (para testing)
router.post("/pets/:id/weight/force", async (req, res) => {
    try {
        const { cantidad = 5 } = req.body;
        const result = await petService.forzarAumentoPeso(req.params.id, cantidad);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Migrar mascotas existentes al sistema Pou (nueva función)
router.post("/pets/migrate", async (req, res) => {
    try {
        const pets = await petService.migrarMascotasExistentes();
        res.json({ 
            message: 'Mascotas migradas exitosamente al sistema Pou',
            mascotas: pets 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener estadísticas del sistema (nueva función)
router.get("/pets/stats/system", async (req, res) => {
    try {
        const stats = await petService.getSistemaStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router; 