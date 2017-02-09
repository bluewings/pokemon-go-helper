const moment = require('moment');
const pokedex = require('../pokedex');
const { fastAttacks, specialAttacks } = require('../pokedex/moves');
const xlsx = require('../lib/xlsx');

const dictionary = Object.assign(...pokedex.pokemons.map(each => ({ [each.id]: each })));

module.exports = (pokeio, options) => {
  pokeio.getInventory()
    .then((inventory) => {
      const { inventoryDelta: { inventoryItems } } = inventory;

      const items = inventoryItems.map(each => each.inventoryItemData);

      const candies = Object.assign(...items.map(each => each.pokemonFamily)
        .filter(each => each)
        .map(each => ({ [each.familyId]: each })));

      const summary = items.map(each => each.pokemon)
        .filter(each => each && !each.isEgg)
        .map((each) => {
          const { pokemonId } = each;
          const fromPodex = dictionary[pokemonId] || {};
          const iv = (each.individualAttack || 0) +
            (each.individualDefense || 0) +
            (each.individualStamina || 0);
          const ivPercent = Math.floor((iv / 45) * 1000) / 10;
          let ivGrade;
          if (ivPercent === 100) {
            ivGrade = 'SSS';
          } else if (ivPercent >= 95) {
            ivGrade = 'SS';
          } else if (ivPercent >= 90) {
            ivGrade = 'S';
          } else if (ivPercent >= 80) {
            ivGrade = 'A';
          } else if (ivPercent >= 60) {
            ivGrade = 'B';
          } else if (ivPercent >= 40) {
            ivGrade = 'C';
          } else {
            ivGrade = 'D';
          }
          const move1 = fastAttacks[each.move_1] || specialAttacks[each.move_1] || [];
          const move2 = fastAttacks[each.move_2] || specialAttacks[each.move_2] || [];
          const next = Object.assign({
            pokemonId,
            familyId: fromPodex.familyId || pokemonId,
            nickname: null,
            nameKo: fromPodex.nameKo || `#${pokemonId}`,
            nameEn: fromPodex.nameEn || `#${pokemonId}`,
            nameJa: fromPodex.nameJa || `#${pokemonId}`,
            candies: (candies[fromPodex.familyId || pokemonId] || {}).candy || 0,
            candyCount: fromPodex.candyCount || false,
            ivGrade,
            ivPercent,
            individualAttack: null,
            individualDefense: null,
            individualStamina: null,
            cp: null,
            stamina: null,
            staminaMax: null,
            move_1: null,
            move_1_name: move1[0],
            move_1_type: move1[1],
            move_1_power: move1[2],
            move_2: null,
            move_2_name: move2[0],
            move_2_type: move2[1],
            move_2_power: move2[2],
            heightM: null,
            weightKg: null,
            cpMultiplier: null,
            pokeball: null,
          }, each);
          delete next.id;
          delete next.capturedCellId;
          delete next.creationTimeMs;
          return next;
        })
        .reduce((data, each) => {
          const row = [];
          Object.keys(each).forEach((key) => {
            let keyIndex = data.head.indexOf(key);
            if (keyIndex === -1) {
              data.head.push(key);
              keyIndex = data.head.length - 1;
            }
            row[keyIndex] = each[key] === 0 ? 0 : (each[key] || '');
          });
          data.body.push(row);
          return data;
        }, {
          head: [],
          body: [],
        });

      summary.body = summary.body.sort((a, b) => {
        // 같은 진화캔디
        if (parseInt(a[1], 10) < parseInt(b[1], 10)) {
          return -1;
        }
        if (parseInt(a[1], 10) > parseInt(b[1], 10)) {
          return 1;
        }
        // 포켓몬 id
        if (parseInt(a[0], 10) < parseInt(b[0], 10)) {
          return -1;
        }
        if (parseInt(a[0], 10) > parseInt(b[0], 10)) {
          return 1;
        }
        // 개체값이 높은 것부터
        if (a[9] > b[9]) {
          return -1;
        }
        if (a[9] < b[9]) {
          return 1;
        }
        return 0;
      });

      const xlsxData = summary.body.slice();
      xlsxData.unshift(summary.head);
      const filepath = xlsx.writeFile(xlsxData, `${(options.username || '').split('@')[0]}.pokemons.${moment().format('YYYYMMDDHHmmss')}.xlsx`);
      console.log('');
      console.log(`[i] Saved as an Excel file. - ${filepath}`);
    });
};
