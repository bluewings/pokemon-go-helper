const { pokemons } = require('./pokedex.json');
const { keysToCamelCase } = require('../lib/util');

const getKey = name => (name || '').toLowerCase().replace(/([\s\\’']|\(.*?\))/g, '');

const dictionary = require('./pokemon-names.json').names.reduce((prev, curr) => {
  const [num, en, ko, ja] = curr;
  const key = getKey(en);
  // pokedex (https://github.com/Biuni/PokemonGOPokedex)에 151번까지밖에 없다.
  // 추가 포켓몬들은 우선 http://ko.pokemon.wikia.com/wiki/국가별_포켓몬_이름_목록 기준으로 채운다.
  // 단 이 경우 familyId 나 candyCount 등의 정보가 부정확하여 진화 계산에서 누락된다.
  if (pokemons.filter(pokemon => getKey(pokemon.name) === key).length === 0) {
    pokemons.push({
      id: parseInt(num, 10),
      num,
      name: en,
    });
  }
  return Object.assign({}, prev, {
    [key]: { en, ko, ja },
  });
}, {});

exports.pokemons = keysToCamelCase(pokemons).map((pokemon) => {
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
