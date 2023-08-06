// index.js

const express = require('express');
const app = express();
const port = 3000;

// Middleware para parsear el cuerpo de las solicitudes en JSON
app.use(express.json());

// Configuración de la conexión a MongoDB y obtención de la colección
const { MongoClient, ObjectId } = require('mongodb');
const uri = 'mongodb+srv://anchiaprogram1:hw85jSFpdTgDPW1J@cluster0.tdratzf.mongodb.net/';
const client = new MongoClient(uri, { useUnifiedTopology: true });

let cardsCollection;

async function start() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    // Obtener la colección de pokémons
    const db = client.db('Pikachu');
    cardsCollection = db.collection('pokemones');

    // Configurar las rutas para la Pokedex
    const pokedexRouter = require('./routes/pokedex');
    app.use('/pokedex', pokedexRouter);

    // Servir archivos estáticos desde la carpeta "public"
    app.use(express.static('public'));

    // Iniciar el servidor
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

start();
