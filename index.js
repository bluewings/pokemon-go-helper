const fsExtra = require('fs-extra');
const path = require('path');
const Pokeio = require('./lib/Pokeio').Pokeio;
const pokedex = require('./pokedex');

const config = {
  username: process.env.PGO_USERNAME || 'GMAIL_USERNAME',
  password: process.env.PGO_PASSWORD || 'GMAIL_PASSWORD',
  location: process.env.PGO_LOCATION || '독도',
};

process.argv.forEach((arg) => {
  const [, key, value] = arg.match(/^--(username|password|location):(.*)$/) || [];
  if (key && typeof config[key] !== 'undefined') {
    config[key] = value;
  }
});

const pokeio = new Pokeio();
const dictionary = Object.assign(...pokedex.pokemons.map(each => ({ [each.id]: each })));

// https://github.com/Armax/Pokemon-GO-node-api 에 이름 변경관련 시그너처가 제외되어 있어 추가함.
['pokemon-go-node-api/poke.io.js', 'pokemon-go-node-api/pokemon.proto'].forEach((filename) => {
  fsExtra.copySync(path.resolve(__dirname, `./lib/${filename}`), path.resolve(__dirname, `./node_modules/${filename}`));
});

pokeio.init(config.username, config.password, config.location)
  .then(() => pokeio.getInventory())
  .then((inventory) => {
    const { inventoryDelta: { inventoryItems } } = inventory;

    const items = inventoryItems.map(each => each.inventoryItemData);

    const candies = Object.assign(...items.map(each => each.pokemonFamily)
      .filter(each => each)
      .map(each => ({ [each.familyId]: each })));

    const pokemons = items.map(each => each.pokemon)
      .filter(each => each && !each.isEgg)
      // pokodex 를 참고로 추가 정보를 붙임
      .map((each) => {
        const iv = (each.individualAttack || 0) +
          (each.individualDefense || 0) +
          (each.individualStamina || 0);
        const ivPercent = (`00${Math.min(99, Math.floor((iv / 45) * 100))}`).substr(-2);
        const fromPodex = dictionary[each.pokemonId] || {};
        let ivGrade;
        if (ivPercent === '99') {
          ivGrade = 'X';
        } else if (ivPercent >= '95') {
          ivGrade = 'SS';
        } else if (ivPercent >= '90') {
          ivGrade = 'S';
        } else if (ivPercent >= '80') {
          ivGrade = 'A';
        } else if (ivPercent >= '60') {
          ivGrade = 'B';
        } else if (ivPercent >= '40') {
          ivGrade = 'C';
        } else {
          ivGrade = 'D';
        }
        return Object.assign({}, each, {
          familyId: fromPodex.familyId || each.pokemonId,
          nameKo: fromPodex.nameKo || `#${each.pokemonId}`,
          nameEn: fromPodex.nameEn || `#${each.pokemonId}`,
          nameJa: fromPodex.nameJa || `#${each.pokemonId}`,
          candyCount: fromPodex.candyCount || false,
          iv,
          ivPercent,
          ivGrade,
        });
      })
      // 진화캔디를 사용할 순서에 따라 정렬
      .sort((a, b) => {
        // 같은 진화캔디
        if (a.familyId < b.familyId) {
          return -1;
        }
        if (a.familyId > b.familyId) {
          return 1;
        }
        // 진화캔디 소모가 적은 것부터
        if (a.candyCount < b.candyCount) {
          return -1;
        }
        if (a.candyCount > b.candyCount) {
          return 1;
        }
        // 개체값이 높은 것부터
        if (a.ivPercent > b.ivPercent) {
          return -1;
        }
        if (a.ivPercent < b.ivPercent) {
          return 1;
        }
        return 0;
      })
      // 진화대상을 정하고, 닉네임을 정한다.
      .map((each) => {
        let evolve = false;
        if (candies[each.familyId] && each.candyCount &&
          candies[each.familyId].candy >= each.candyCount) {
          candies[each.familyId].candy -= each.candyCount;
          evolve = true;
        }
        return Object.assign({}, each, {
          evolve,
          newNickname: [each.nameKo, each.ivPercent, each.ivGrade, evolve ? '•' : undefined].join(' ').trim(),
        });
      });

    return pokemons;
  })
  // 변경 대상의 닉네임을 변경한다.
  .then((pokemons) => {
    // 현재의 닉네임과 변경할 닉네임이 다른 것들만 실제 변경 대상
    const targets = pokemons.filter(each => each.nickname !== each.newNickname);
    if (targets.length === 0) {
      console.log('[i] nothing to update.');
      return;
    }
    console.log(`[i] updateing ${targets.length} items.`);
    targets.reduce((promise, pokemon) => promise.then(() => {
      // 하나씩 이름을 변경한다.
      return pokeio.renamePokemon(pokemon.id, pokemon.newNickname);
    }), Promise.resolve());
  });
