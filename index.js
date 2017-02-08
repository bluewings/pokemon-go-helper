const fsExtra = require('fs-extra');
const path = require('path');
const Pokeio = require('./lib/Pokeio').Pokeio;
const util = require('./lib/util');
const task = require('./task');

const config = {
  username: process.env.PGO_USERNAME || null,
  password: process.env.PGO_PASSWORD || null,
  location: process.env.PGO_LOCATION || '경기도 성남시 분당구 정자동',
  task: 0,
};

process.argv.forEach((arg) => {
  const [, key, value] = arg.match(/^--(username|password|location):(.*)$/) || [];
  if (key && typeof config[key] !== 'undefined') {
    config[key] = value;
  }
});

const pokeio = new Pokeio();

// https://github.com/Armax/Pokemon-GO-node-api 에 이름 변경관련 시그너처가 제외되어 있어 추가함.
['pokemon-go-node-api/poke.io.js', 'pokemon-go-node-api/pokemon.proto'].forEach((filename) => {
  fsExtra.copySync(path.resolve(__dirname, `./lib/${filename}`), path.resolve(__dirname, `./node_modules/${filename}`));
});

let next;

if (config.username && config.password) {
  next = Promise.resolve(config);
} else {
  next = util.ask('[Pokémon Go Helper] gmail: ')
    .then((username) => {
      config.username = username || config.username;
      return util.askHidden('[Pokémon Go Helper] password: ');
    })
    .then((password) => {
      config.password = password || config.password;
      return util.askHidden('[Pokémon Go Helper] location: ');
    })
    .then((location) => {
      config.location = location || config.location;
      return config;
    });
}

next.then((userConfig) => {
  pokeio.init(userConfig.username, userConfig.password, userConfig.location)
    .then(() => {
      // task[userConfig.]
      if (task[userConfig.task] && typeof task[userConfig.task].runner === 'function') {
        console.log(`[i] execute '${task[userConfig.task].name}' task. : ${task[userConfig.task].description}`);
        task[userConfig.task].runner(pokeio);
      } else {
        console.log('[i] unknown task.');
      }
    });
});
