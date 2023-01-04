const { Router } = require('express');
const axios = require('axios');
const { Pokemon, Type } = require('../db.js');
const apiAllUrl = 'https://pokeapi.co/api/v2/pokemon'
const { createPokemon, getPokeDb } =  require('../utils/utils.js');

const router = Router();

/* router.get("/", async (req, res) => {
  const pokeu = await getAllPokemon()
  res.status(200).send(pokeu); */
  /* let pokeList;
  await axios.get("https://pokeapi.co/api/v2/pokemon").then((res) => {
    pokeList = res.data.map((p) => {
      return {
        name: p.name,
        id: p.id,
        speed: p.speed ? p.speed[5] : "Error pokemon",
        hp: p.hp[0],
        attack: p.attack,
        height: p.height,
        weight: p.weight,
        defense: p.defense,
        };
    });
  });
  await Pokemon.bulkCreate(pokeList);
  return res.status(200).send(pokeList); */
/*});*/

router.get("/", async (req, res) => {
    try {
      const { name } = req.query;
      let infoAll = await getPokeDb(); // mi db
  
      // si hay nombre
      if (name) {
        let pokeName = infoAll.filter( // filtro en db por el 'name'
          (poke) => poke.name.toLowerCase() === name.toLowerCase()
        );
        pokeName.length
          // si lo tengo lo mando 
          ? res.status(200).send(pokeName)
          // sino, no existe el pokemón
          : res.status(404).send("Pokémon no encontrado");
      }
      // sino no me pasan nombre, mando todos los pokemons
      else {
        res.status(200).send(infoAll)
      }
    } catch (error) {
      console.log('ERROR EN RUTA A /pokemons', error)
    }
});


//RUTA POST-> /pokemons (crear pokemon)
router.post("/", async (req, res) => {
    try {
      const dataPokemon = req.body;
      const info = await getPokeDb();
  
      // si no me pasa un nombre, no creo nada
      if (!dataPokemon.name) {
        return res.status(404).send("El nombre del pokemón es obligatorio");
      }
      // si me pasan un nombre:
      if (dataPokemon.name) {
        // busco si un pokemon con ese nombre ya existe
        let pokemon = info.find(poke => poke.name === dataPokemon.name);
        // si no existe, creo el pokemon
        if (!pokemon) {
          await createPokemon(dataPokemon);
          res.status(200).send("El pokemón ha sido creado con éxito");
        }
        // y sino, significa que el nombre es repetido
        else {
          res.status(404).send("El nombre del pokemón ya existe");
        }
      }
    } catch (error) {
      res.status(400).send('No se puede crear el pokemón', error)
    }
  });


  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const pokemon = await getPokeDb();
      if (id){
        const resultID = pokemon.find((p) => p.id == id);
        res.status(200).json(resultID);
      }
    } catch (error) {
      console.log("Error trying to get details");
      console.error(error);
    }
  });


router.delete("/:pokeId", async (req, res) => {
    const { pokeId } = req.params;
    const deleted = deletePokemon(pokeId);
    res.json(deleted);
  });

  module.exports = router;