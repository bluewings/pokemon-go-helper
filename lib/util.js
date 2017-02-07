const entries = require('object.entries');

const strlen = str => (`${str}`).split('').reduce((count, char) => count + (char.search(/[ㄱ-ㅎ가-힣]/) === -1 ? 1 : 2), 0);

const printTable = (rows) => {
  const colLen = rows.reduce((prev, cols) => {
    const next = prev.slice();
    cols.forEach((each, i) => {
      next[i] = Math.max(next[i] || 0, strlen(each));
    });
    return next;
  }, []);

  const lines = [];
  lines.push(` +${colLen.map(len => Array(len + 2).fill('-').join('')).join('+')}+`);
  rows.forEach((cols) => {
    const line = [''];
    Array(5).fill(2);
    cols.forEach((col, i) => {
      const padding = Array(colLen[i] - strlen(col)).fill(' ').join('');
      if (typeof col === 'number') {
        line.push(padding + col);
      } else {
        line.push(col + padding);
      }
    });
    line.push('');
    lines.push(line.join(' | '));
  });
  lines.push(` +${colLen.map(len => Array(len + 2).fill('-').join('')).join('+')}+`);
  return lines.join('\n');
};

const keysToCamelCase = (source) => {
  if (Array.isArray(source)) {
    return source.map(each => keysToCamelCase(each));
  } else if (typeof source === 'object' && source !== null) {
    return entries(source).reduce((target, [key, value]) => {
      const newKey = key.replace(/\_([a-z])/g, (whole, p1) => p1.toUpperCase());
      return Object.assign({}, target, { [newKey]: keysToCamelCase(value) });
    }, {});
  }
  return source;
};

exports.printTable = printTable;
exports.keysToCamelCase = keysToCamelCase;
