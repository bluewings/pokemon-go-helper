const values = require('object.values');
const pokedex = require('../pokedex');
const util = require('../lib/util');

const dictionary = Object.assign(...pokedex.pokemons.map(each => ({ [each.id]: each })));

const EVOLVE_XP = 500;
const CAPTURE_XP = 500;

module.exports = (pokeio) => {
  pokeio._getInventory()
    .then((inventory) => {
      const { inventoryDelta: { inventoryItems } } = inventory;

      const items = inventoryItems.map(each => each.inventoryItemData);

      const candies = Object.assign(...items.map(each => each.pokemonFamily)
        .filter(each => each)
        .map(each => ({ [each.familyId]: each })));

      const captured = Object.assign(...items.map(each => each.pokedexEntry)
        .filter(each => each && each.timesCaptured)
        .map(each => ({ [each.pokedexEntryNumber]: each })));

      const pokemons = values(items.map(each => each.pokemon)
        .filter(each => each && !each.isEgg)
        .reduce((prevState, curr) => {
          const { pokemonId } = curr;
          const fromPodex = dictionary[pokemonId] || {};
          const nextState = Object.assign({}, prevState);
          if (!nextState[pokemonId]) {
            nextState[pokemonId] = {
              pokemonId,
              familyId: fromPodex.familyId || pokemonId,
              nextId: fromPodex.nextId,
              nameKo: fromPodex.nameKo || `#${pokemonId}`,
              nameEn: fromPodex.nameEn || `#${pokemonId}`,
              nameJa: fromPodex.nameJa || `#${pokemonId}`,
              candyCount: fromPodex.candyCount || false,
              count: 0,
            };
          }
          nextState[pokemonId].count += 1;
          return nextState;
        }, {}))
        // 진화캔디를 사용할 순서에 따라 정렬
        .sort((a, b) => {
          // 같은 진화캔디
          if (a.familyId < b.familyId) {
            return -1;
          }
          if (a.familyId > b.familyId) {
            return 1;
          }
          const aCandyCount = a.candyCount !== false ? a.candyCount : 99999;
          const bCandyCount = b.candyCount !== false ? b.candyCount : 99999;
          // 진화캔디 소모가 적은 것부터
          if (aCandyCount < bCandyCount) {
            return -1;
          }
          if (aCandyCount > bCandyCount) {
            return 1;
          }
          return 0;
        });
      return {
        candies,
        captured,
        pokemons,
      };
    })
    .then(({ candies, captured, pokemons }) => {
      const rows = [];
      let totalXP = 0;
      pokemons.forEach((each) => {
        const { pokemonId, familyId, nextId, nameKo, candyCount, count } = each;
        const pokeId = (`000${pokemonId}`).substr(-3);
        const availCandy = candies[familyId] || { candy: 0 };
        const evolveCount = Math.min(each.candyCount ? Math.floor(availCandy.candy / each.candyCount) : 0, each.count);
        const usedCandy = evolveCount * each.candyCount;
        const evolveXP = evolveCount * EVOLVE_XP;
        const captureXP = (evolveCount && nextId && !captured[nextId]) ? CAPTURE_XP : 0;
        totalXP += evolveXP + captureXP;

        rows.push([
          familyId,
          pokeId,
          nameKo,
          count,            // 총개체수
          availCandy.candy, // 보유캔디: 해당 패밀리의 캔디 잔여 수량
          candyCount || '', // 필요캔디: 진화에 필요한 캔디
          evolveCount,      // 진화개체: 진화 가능한 개체 수
          usedCandy,        // 사용캔디: 사용한 캔디 수
          evolveXP,         // 진화점수
          captureXP,        // 발견점수
          totalXP,          // 누적점수
        ]);
        availCandy.candy -= usedCandy;
      });
      const table = util.printTable({
        head: [
          '종족', '번호', '이름', '총개체수',
          '보유캔디', '필요캔디', '진화개체', '사용캔디',
          '진화점수', '발견점수', '누적점수',
        ],
        body: rows,
      });
      console.log(table);
    });
};
