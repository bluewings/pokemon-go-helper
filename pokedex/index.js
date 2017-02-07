const { keysToCamelCase } = require('../lib/util');

const getKey = name => (name || '').toLowerCase().replace(/([\s\\’']|\(.*?\))/g, '');

const dictionary = require('./pokemon-names.json').names.reduce((prev, curr) => {
  const [en, ko, ja] = curr;
  return Object.assign({}, prev, {
    [getKey(en)]: { en, ko, ja },
  });
}, {});

const pokemons = keysToCamelCase(require('./pokedex.json').pokemons).map((pokemon) => {
  const familyId = parseInt(pokemon.prevEvolution && pokemon.prevEvolution[0] ?
    pokemon.prevEvolution[0].num : pokemon.id, 10);
  const nextId = pokemon.nextEvolution && pokemon.nextEvolution[0] ?
    parseInt(pokemon.nextEvolution[0].num, 10) : null;
  const found = dictionary[getKey(pokemon.name)];
  return Object.assign({}, pokemon, {
    familyId,
    nextId,
    candyCount: pokemon.candyCount || null,
    nameEn: found.en || pokemon.name,
    nameKo: found.ko || pokemon.name,
    nameJa: found.ja || pokemon.name,
  });
}).sort((a, b) => {
  if (a.familyId < b.familyId) {
    return -1;
  }
  if (a.familyId > b.familyId) {
    return 1;
  }
  return 0;
});

exports.pokemons = pokemons;
