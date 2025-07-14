import Pet from '../models/petModel.js';
import mongoose from 'mongoose';

export async function getPets() {
  return await Pet.find({}).lean();
}

export async function savePets(pets) {
  // Este método ya no es necesario, pero lo dejamos para compatibilidad
  // Puedes actualizar o eliminar según tu lógica de negocio
  return;
}

export async function addPet(petData) {
  const pet = new Pet(petData);
  await pet.save();
  return pet;
}

export async function updatePet(id, updatedPet) {
  return await Pet.findOneAndUpdate({ id: Number(id) }, updatedPet, { new: true });
}

export async function deletePet(id) {
  return await Pet.findOneAndDelete({ id: Number(id) });
}

export async function getPetById(id) {
  // Si es un ObjectId válido, buscar por _id
  if (typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)) {
    return await Pet.findById(id).lean();
  }
  // Si es un número válido, buscar por id
  const numId = Number(id);
  if (!isNaN(numId)) {
    return await Pet.findOne({ id: numId }).lean();
  }
  // Si no es válido, retorna null
  return null;
} 