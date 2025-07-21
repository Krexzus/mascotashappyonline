import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  userId: { type: Number, required: true }, // NUEVO CAMPO para privacidad
  nombre: { type: String, required: true },
  tipo: { type: String, required: true },
  superpoder: { type: String, required: true },
  felicidad: { type: Number, default: 100 },
  vida: { type: Number, default: 100 },
  personalidad: { type: String, default: 'normal' },
  enfermedades: { type: [String], default: [] },
  items: { 
    type: [{
      nombre: { type: String, required: true },
      tipo: { type: String, required: true },
      color: { type: String, default: "#000000" },
      descripcion: { type: String, default: "" },
      fechaObtenido: { type: String, default: () => new Date().toISOString() },
      equipado: { type: Boolean, default: false }
    }], 
    default: [] 
  },
  hambre: { type: Number, default: 0 },
  sed: { type: Number, default: 0 },
  energia: { type: Number, default: 100 },
  peso: { type: Number, default: 50 },
  ultimaActualizacion: { type: String, default: null }
});

const Pet = mongoose.model('Pet', petSchema, 'pets');

export default Pet; 