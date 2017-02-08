const PokemonGO = require('pokemon-go-node-api');

const { keysToCamelCase } = require('./util');

class Pokeio {
  constructor() {
    this.instance = new PokemonGO.Pokeio();
  }

  init(username, password, locationName) {
    const self = this;
    return new Promise((resolve, reject) => {
      const location = {
        type: 'name',
        name: locationName || process.env.PGO_LOCATION || 'Time Square',
      };
      self.instance.init(username, password, location, 'google', (err) => {
        if (err) {
          return reject(err);
        }
        const { playerInfo } = self.instance;
        console.log(`[i] Current location: ${playerInfo.locationName}`);
        console.log(`[i] lat/long/alt: : ${playerInfo.latitude} ${playerInfo.longitude} ${playerInfo.altitude}`);
        return resolve(playerInfo);
      });
    });
  }

  getInventory() {
    const self = this;
    return new Promise((resolve, reject) => {
      self.instance.GetInventory((err, inventory) => {
        if (err) {
          return reject(err);
        }
        // 순환참조를 막기위해서 JSON.stringify > JSON.parse
        return resolve(keysToCamelCase(JSON.parse(JSON.stringify(inventory))));
      });
    });
  }

  renamePokemon(id, name) {
    const self = this;
    return new Promise((resolve) => {
      try {
        console.log(`[i] update nickname: ${name}`);
        self.instance.RenamePokemon(id, name);
      } catch (err) { /* noop */ }
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }

  // 샘플데이터로 테스트하기 위한 함수 (실제 데이터가 아님)
  // eslint-disable-next-line class-methods-use-this
  _getInventory() {
    return new Promise((resolve) => {
      // eslint-disable-next-line global-require
      resolve(require('../sample/json/inventory.sample.json'));
    });
  }
}

exports.Pokeio = Pokeio;
