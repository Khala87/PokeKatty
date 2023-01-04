const axios = require('axios')
const { Pokemon, Type } = require('../db.js')

const getApiInfo = async () => {
    try {
        // Traigo la info de la API (40 pokemons)
        const getApi = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=40');

        // entro a la url de cada pokemon:
        const getUrlPoke = getApi.data.results.map(e => axios.get(e.url));

        // hace solicitudes simultaneas: (me trae la info del pokemon que más rapido se realice la petición)
        const urlPokemons = await axios.all(getUrlPoke);

        // obtengo la data de cada pokemon por su url: 
        let dataPoke = urlPokemons.map(e => e.data);

        // traigo los datos de cada pokemón:
        let infoPokemons = dataPoke.map(p => {
            return {
                id: p.id,
                name: p.name,
                hp: p.stats[0].base_stat,
                attack: p.stats[1].base_stat,
                defense: p.stats[2].base_stat,
                speed: p.stats[5].base_stat,
                height: p.height,
                weight: p.weight,
                image: p.sprites.other.dream_world.front_default,
                types: p.types.map((poke) => poke.type.name),
                createInDb: p.is_default // esto para diferenciarlos a los poke que vienen de la API
            }
        })
        infoPokemons.forEach(async(poke)=>{
          await createPokemon(poke)
        });
        return infoPokemons

    } catch (error) {
        console.log('ERROR EN getApiInfo', error);
    }
};
const getAllTypes = async () => {
    try {
        // Traigo los types de la API
        let getTypes = await axios.get('https://pokeapi.co/api/v2/type');

        // accedo a la data de cada type (API)
        let dataType = getTypes.data.results.map(type => type.name);

        // recorro cada type para saber si existe o no
        dataType.forEach(type => {
            Type.findOrCreate({ // si no existe lo crea
                where: { name: type }
            })
        });

        // Traigo los types de mi db
        let types = await Type.findAll();
        return types;

    } catch (error) {
        console.log("ERROR EN getAllTypes", error);
    }
};

/* const getApiPokemonByName = async (name) => {
    try {
      const foundPokemon = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${name}`
      );
      const pokemon = foundPokemon.data;
      const pokeName = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
      const types = pokemon.types.map(
        (e) => e.type.name[0].toUpperCase() + e.type.name.slice(1)
      );
      return [
        {
          id: pokemon.id,
          name: pokeName,
          image: pokemon.sprites.other.home.front_default,
          types,
          attack: pokemon.stats[1].base_stat,
        },
      ];
    } catch (e) {
      console.log(e);
    }
  } */
   
  /* const getApiPokemonById= async (id) => {
    try {
      const foundPokemon = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${id}`
      );
      const pokemon = foundPokemon.data;
      const types = pokemon.types.map((t) => t.type.name);
      const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
      return {
        id: pokemon.id,
        image: pokemon.sprites.other.home.front_default,
        name,
        types,
        hp: pokemon.stats[0].base_stat,
        attack: pokemon.stats[1].base_stat,
        defense: pokemon.stats[2].base_stat,
        speed: pokemon.stats[5].base_stat,
        height: pokemon.height,
        weight: pokemon.weight,
      };
    } catch (e) {
      console.log(e);
    }
  } */

  const createPokemon = async (dataPokemon) => { // recibe datos del body
    try {
        // esto para el request del body (req.body) en ruta 'POST'
        const { name, hp, attack, defense, speed, height, weight, image, types, isDefault } = dataPokemon;
        // creo al pokemón en mi db
        const newPokemon = await Pokemon.create(
            {
                name,
                hp,
                attack,
                defense,
                speed,
                height,
                weight,
                image,
                isDefault,
            }
        );
        // busco en mi tabla Type el nombre del type
        const typePokeDB = await Type.findAll({
            where: { name: types } // que coincida con el que me pasan
        });

        // a mi nuevo pokemón le agrego el type en la base de datos
        let createdPoke = newPokemon.addType(typePokeDB);
        return createdPoke;

    } catch (error) {
        console.log('ERROR EN createPokemon', error);
    }
}

const getPokeDb = async () => {
    try {
        //traigo pokemons de mi base de datos:
        return await Pokemon.findAll({
            include: { // que incluya el type
                model: Type,
                attributes: ['name'], // traigo el nombre del type como atributo
                through: {
                    attributes: [],
                },
            }
        })
    } catch (error) {
        console.log('ERROR EN getPokeDb', error);
    }
};
//TRAIGO TODOS LOS POKEMONES, TANTO DE LA API COMO DE LA DB.
const getAllPokemon = async () => {
    const apiInfo = await getApiInfo();
    const dbInfo = await getPokeDb();
    const getAllPokemon = apiInfo.concat(dbInfo);
    return getAllPokemon;
};

module.exports = {
    getApiInfo, 
    getPokeDb, 
    createPokemon, 
    getAllPokemon, 
    getAllTypes, 
    //getApiPokemonById, 
    //getApiPokemonByName
}
