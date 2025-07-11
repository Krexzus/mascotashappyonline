import heroRepository from '../repositories/heroRepository.js'
import petRepository from '../repositories/petRepository.js'

async function getAllHeroes() {
    const heroes = await heroRepository.getHeroes();
    const pets = await petRepository.getPets();
    // Asocia la mascota al héroe si tiene petId
    return heroes.map(hero => {
        const pet = hero.petId ? pets.find(p => p.id === hero.petId) : null;
        return {
            ...hero,
            mascota: pet || null
        };
    });
}

async function addHero(hero) {
    if (!hero.name || !hero.alias) {
        throw new Error("El héroe debe tener un nombre y un alias.");
    }

    const heroes = await heroRepository.getHeroes();
    const newId = heroes.length > 0 ? Math.max(...heroes.map(h => h.id)) + 1 : 1;
    const newHero = { ...hero, id: newId };
    heroes.push(newHero);
    await heroRepository.saveHeroes(heroes);
    return newHero;
}

async function updateHero(id, updatedHero) {
    const heroes = await heroRepository.getHeroes();
    const index = heroes.findIndex(hero => hero.id === parseInt(id));
    if (index === -1) {
        throw new Error('Héroe no encontrado');
    }
    delete updatedHero.id;
    heroes[index] = { ...heroes[index], ...updatedHero };
    await heroRepository.saveHeroes(heroes);
    return heroes[index];
}

async function deleteHero(id) {
    const heroes = await heroRepository.getHeroes();
    const index = heroes.findIndex(hero => hero.id === parseInt(id));
    if (index === -1) {
        throw new Error('Héroe no encontrado');
    }
    const filteredHeroes = heroes.filter(hero => hero.id !== parseInt(id));
    await heroRepository.saveHeroes(filteredHeroes);
    return { message: 'Héroe eliminado' };
}

async function findHeroesByCity(city) {
    const heroes = await heroRepository.getHeroes();
    return heroes.filter(hero => hero.city && hero.city.toLowerCase() === city.toLowerCase());
}

async function faceVillain(heroId, villain) {
    const heroes = await heroRepository.getHeroes();
    const hero = heroes.find(hero => hero.id === parseInt(heroId));
    if (!hero) {
        throw new Error('Héroe no encontrado');
    }
    return `${hero.alias} enfrenta a ${villain}`;
}

async function adoptPet(heroId, petId) {
    const heroes = await heroRepository.getHeroes();
    const pets = await petRepository.getPets();
    const heroIndex = heroes.findIndex(h => h.id === parseInt(heroId));
    if (heroIndex === -1) {
        throw new Error('Héroe no encontrado');
    }
    const pet = pets.find(p => p.id === parseInt(petId));
    if (!pet) {
        throw new Error('Mascota no encontrada');
    }
    heroes[heroIndex].petId = pet.id;
    await heroRepository.saveHeroes(heroes);
    return {
        message: `El héroe ${heroes[heroIndex].alias} ha adoptado a la mascota ${pet.nombre}`,
        hero: heroes[heroIndex],
        mascota: pet
    };
}

async function adoptRandomPet(heroId) {
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

export default {
    getAllHeroes,
    addHero,
    updateHero,
    deleteHero,
    findHeroesByCity,
    faceVillain,
    adoptPet,
    adoptRandomPet
} 