const rename = require('./rename');
// const simulateEvolution = require('./simulate-evolution');

module.exports = [
  {
    name: 'rename',
    description: '포켓몬의 닉네임을 변경합니다.',
    runner: rename,
  },
  // {
  //   name: 'simulate-evolution',
  //   description: '진화로 획득가능한 경험치를 계산합니다.',
  //   runner: simulateEvolution,
  //   options: {
  //     printCSV: 'CSV 형태로 표시할까요? (엑셀 사용시 용이) [y/n]',
  //     pointOnly: '경험치가 발생하는 포켓몬만 표시할까요? (y/n)',
  //   },
  // },
];
