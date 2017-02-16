const fsExtra = require('fs-extra');
const path = require('path');
// const Pokeio = require('./lib/Pokeio').Pokeio;
const Pokeio = require('./lib/pogobuf').Pokeio;
const util = require('./lib/util');
const task = require('./task');

const config = {
  username: process.env.PGO_USERNAME || null,
  password: process.env.PGO_PASSWORD || null,
  location: process.env.PGO_LOCATION || '경기도 성남시 분당구 정자동',
  task: 1,
};

process.argv.forEach((arg) => {
  const [, key, value] = arg.match(/^--(username|password|location|task):(.*)$/) || [];
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
      return util.ask('[Pokémon Go Helper] location: ');
    })
    .then((location) => {
      config.location = location || config.location;
      if (task.length <= 1) {
        return config.task;
      }
      const defaultTask = (parseInt(config.task, 10) || 1) - 1;
      console.log('');
      console.log('Please select an action to perform.');
      task.forEach((each, i) => {
        console.log(`${i + 1}. ${each.description}${i === defaultTask ? ' (default)' : ''}`);
      });
      console.log('');
      return util.ask('[Pokémon Go Helper] task number: ');
    })
    .then((taskNum) => {
      if ((`${taskNum}`).search(/^[0-9]+$/) !== -1) {
        config.task = taskNum;
      }
      return config;
    });
}

next.then((userConfig) => {
  console.log('');
  const taskNum = (parseInt(userConfig.task, 10) || 1) - 1;
  if (task[taskNum] && typeof task[taskNum].runner === 'function') {
    let getTaskOpts;
    if (typeof task[taskNum].options === 'object') {
      getTaskOpts = Object.keys(task[taskNum].options).reduce((promise, name) => promise.then(() =>
        util.ask(`[${task[taskNum].name}] ${task[taskNum].options[name]} `)
          .then((value) => {
            // eslint-disable-next-line no-param-reassign
            userConfig[name] = value;
          }))
      , Promise.resolve());
    } else {
      getTaskOpts = Promise.resolve();
    }
    getTaskOpts.then(() => {
      pokeio.init(userConfig.username, userConfig.password, userConfig.location)
        .then(() => {
          console.log(`[i] execute '${task[taskNum].name}' task. : ${task[taskNum].description}`);
          const options = Object.assign({}, userConfig);
          delete options.password;
          task[taskNum].runner(pokeio, options);
        });
    });
  } else {
    console.log('[i] unknown task.');
  }
});
