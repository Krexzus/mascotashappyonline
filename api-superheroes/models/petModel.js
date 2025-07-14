import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  tipo: { type: String, required: true },
  superpoder: { type: String, required: true },
  felicidad: { type: Number, default: 100 },
  vida: { type: Number, default: 100 },
  personalidad: { type: String, default: 'normal' },
  enfermedades: { type: [String], default: [] },
  items: { type: [{ nombre: String, tipo: String }], default: [] },
  hambre: { type: Number, default: 0 },
  sed: { type: Number, default: 0 },
  energia: { type: Number, default: 100 },
  peso: { type: Number, default: 50 },
  ultimaActualizacion: { type: String, default: null }
});

const Pet = mongoose.model('Pet', petSchema, 'pets');

export default Pet; 