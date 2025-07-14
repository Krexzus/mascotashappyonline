import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  alias: { type: String, required: true },
  city: { type: String, required: true },
  team: { type: String, required: true },
  petId: { type: Number, default: null }
});

const Hero = mongoose.model('Hero', heroSchema, 'superheroes');

export default Hero; 