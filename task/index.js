const rename = require('./rename');
const simulateEvolution = require('./simulate-evolution');
const downloadPokemons = require('./download-pokemons');

module.exports = [
  {
    name: 'rename',
    description: '포켓몬의 닉네임을 변경합니다.',
    runner: rename,
  },
  {
    name: 'simulate-evolution',
    description: '진화로 획득가능한 경험치를 계산합니다.',
    runner: simulateEvolution,
    options: {
      exportAsXlsx: '엑셀 파일로 내보낼까요? (y/n)',
      pointOnly: '경험치가 발생하는 포켓몬만 표시할까요? (y/n)',
    },
  },
  {
    name: 'download-pokemons',
    description: '포켓몬 목록을 엑셀로 다운로드합니다.',
    runner: downloadPokemons,
  },
];
