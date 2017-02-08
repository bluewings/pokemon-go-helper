const rename = require('./rename');

module.exports = [
  {
    name: 'rename',
    description: '포켓몬의 닉네임을 변경합니다.',
    runner: rename,
  },
];
