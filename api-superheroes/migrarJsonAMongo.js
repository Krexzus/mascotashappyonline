import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';

const MONGODB_URI = 'mongodb+srv://krexzus:2UJOoognhkFO2D6i@mascotashappy.ecnmwrz.mongodb.net/?retryWrites=true&w=majority&appName=mascotashappy';

// Definir esquemas simples
const superheroeSchema = new mongoose.Schema({}, { strict: false });
const petSchema = new mongoose.Schema({}, { strict: false });

const Superheroe = mongoose.model('superheroe', superheroeSchema, 'superheroes');
const Pet = mongoose.model('pet', petSchema, 'pets');

async function migrar() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado a MongoDB Atlas');

    // Leer y migrar superheroes
    const superheroesPath = path.resolve('./superheroes.json');
    const superheroesData = await fs.readFile(superheroesPath, 'utf-8');
    const superheroes = JSON.parse(superheroesData);
    if (Array.isArray(superheroes)) {
      await Superheroe.insertMany(superheroes);
      console.log('Superhéroes migrados correctamente');
    } else {
      console.log('El archivo superheroes.json no contiene un array');
    }

    // Leer y migrar pets
    const petsPath = path.resolve('./pets.json');
    const petsData = await fs.readFile(petsPath, 'utf-8');
    const pets = JSON.parse(petsData);
    if (Array.isArray(pets)) {
      await Pet.insertMany(pets);
      console.log('Mascotas migradas correctamente');
    } else {
      console.log('El archivo pets.json no contiene un array');
    }

    await mongoose.disconnect();
    console.log('Migración completada y desconectado de MongoDB');
  } catch (err) {
    console.error('Error durante la migración:', err);
    await mongoose.disconnect();
  }
}

migrar(); 