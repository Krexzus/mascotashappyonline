import Hero from '../models/heroModel.js';

export async function getHeroes() {
  return await Hero.find({}).lean();
}

export async function saveHeroes(heroes) {
  // Este método ya no es necesario, pero lo dejamos para compatibilidad
  // Puedes actualizar o eliminar según tu lógica de negocio
  return;
}

export async function addHero(heroData) {
  const hero = new Hero(heroData);
  await hero.save();
  return hero;
}

export async function updateHero(id, updatedHero) {
  return await Hero.findOneAndUpdate({ id: Number(id) }, updatedHero, { new: true });
}

export async function deleteHero(id) {
  return await Hero.findOneAndDelete({ id: Number(id) });
}

export async function findHeroesByCity(city) {
  return await Hero.find({ city }).lean();
} 