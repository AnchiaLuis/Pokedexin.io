// routes/pokedex.js

const express = require('express');
const router = express.Router();

// Obtener todos los pokémons registrados
router.get('/', async (req, res) => {
  try {
    const pokemons = await cardsCollection.find({}).toArray();
    res.json(pokemons);
  } catch (err) {
    console.error('Error retrieving pokémons:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Registrar un nuevo pokémon
router.post('/', async (req, res) => {
  try {
    const newPokemon = req.body;
    const result = await cardsCollection.insertOne(newPokemon);
    res.json(result.ops[0]);
  } catch (err) {
    console.error('Error registering new pokémon:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Obtener un pokémon por su ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const pokemon = await cardsCollection.findOne({ _id: ObjectId(id) });
    if (pokemon) {
      res.json(pokemon);
    } else {
      res.status(404).json({ error: 'Pokémon not found' });
    }
  } catch (err) {
    console.error('Error retrieving pokémon:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Actualizar un pokémon
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedPokemon = req.body;
    const result = await cardsCollection.updateOne(
      { _id: ObjectId(id) },
      { $set: updatedPokemon }
    );
    if (result.modifiedCount > 0) {
      res.json({ message: 'Pokémon updated successfully' });
    } else {
      res.status(404).json({ error: 'Pokémon not found' });
    }
  } catch (err) {
    console.error('Error updating pokémon:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Eliminar un pokémon
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await cardsCollection.deleteOne({ _id: ObjectId(id) });
    if (result.deletedCount > 0) {
      res.json({ message: 'Pokémon deleted successfully' });
    } else {
      res.status(404).json({ error: 'Pokémon not found' });
    }
  } catch (err) {
    console.error('Error deleting pokémon:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
