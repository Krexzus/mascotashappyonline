import * as heroRepository from '../repositories/heroRepository.js';
import * as petRepository from '../repositories/petRepository.js';

export async function getAllHeroes() {
  return await heroRepository.getHeroes();
}

export async function addHero(heroData) {
  return await heroRepository.addHero(heroData);
}

export async function updateHero(id, updatedHero) {
  return await heroRepository.updateHero(id, updatedHero);
}

export async function deleteHero(id) {
  return await heroRepository.deleteHero(id);
}

export async function findHeroesByCity(city) {
  return await heroRepository.findHeroesByCity(city);
}

export async function adoptPet(heroId, petId) {
  const hero = await heroRepository.getHeroes().then(heroes => heroes.find(h => h.id === parseInt(heroId)));
  const pet = await petRepository.getPets().then(pets => pets.find(p => p.id === parseInt(petId)));
  if (!hero) throw new Error('Héroe no encontrado');
  if (!pet) throw new Error('Mascota no encontrada');
  hero.petId = pet.id;
  await heroRepository.updateHero(heroId, hero);
  return hero;
}

export async function faceVillain(heroId, villain) {
  const hero = await heroRepository.getHeroes().then(heroes => heroes.find(h => h.id === parseInt(heroId)));
  if (!hero) throw new Error('Héroe no encontrado');
  return `${hero.alias} enfrenta a ${villain}`;
}

export async function adoptRandomPet(heroId) {
    const heroes = await heroRepository.getHeroes();
    const pets = await petRepository.getPets();
    const heroIndex = heroes.findIndex(h => h.id === parseInt(heroId));
    if (heroIndex === -1) {
        throw new Error('Héroe no encontrado');
    }
    // Mascotas ya adoptadas
    const adoptedPetIds = heroes.map(h => h.petId).filter(Boolean);
    // Mascotas disponibles
    const availablePets = pets.filter(p => !adoptedPetIds.includes(p.id));
    if (availablePets.length === 0) {
        throw new Error('No hay mascotas disponibles para adoptar');
    }
    // Elegir una mascota aleatoria
    const pet = availablePets[Math.floor(Math.random() * availablePets.length)];
    heroes[heroIndex].petId = pet.id;
    await heroRepository.saveHeroes(heroes);
    return {
        message: `El héroe ${heroes[heroIndex].alias} ha adoptado a la mascota ${pet.nombre}`,
        hero: heroes[heroIndex],
        mascota: pet
    };
} 