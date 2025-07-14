import express from "express";
import { check, validationResult } from 'express-validator';
import * as heroService from "../services/heroService.js";

const router = express.Router();

router.get("/heroes", async (req, res) => {
    try {
        const heroes = await heroService.getAllHeroes();
        res.json(heroes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/heroes", async (req, res) => {
    try {
        const hero = await heroService.addHero(req.body);
        res.status(201).json(hero);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/heroes/:id", async (req, res) => {
    try {
        const hero = await heroService.updateHero(req.params.id, req.body);
        res.json(hero);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/heroes/:id", async (req, res) => {
    try {
        await heroService.deleteHero(req.params.id);
        res.json({ message: "Héroe eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/heroes/city/:city", async (req, res) => {
    try {
        const heroes = await heroService.findHeroesByCity(req.params.city);
        res.json(heroes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/heroes/:heroId/adopt/:petId", async (req, res) => {
    try {
        const hero = await heroService.adoptPet(req.params.heroId, req.params.petId);
        res.json(hero);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/heroes/:heroId/face-villain", async (req, res) => {
    try {
        const result = await heroService.faceVillain(req.params.heroId, req.body.villain);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router; 