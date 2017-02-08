const entries = require('object.entries');

const strlen = str => (`${str}`).split('').reduce((count, char) => count + (char.search(/[ㄱ-ㅎ가-힣]/) === -1 ? 1 : 2), 0);

const printTable = ({ head, body }, csv) => {
  const colLen = [head || []].concat(body).reduce((prev, cols) => {
    const next = prev.slice();
    cols.forEach((each, i) => {
      next[i] = Math.max(next[i] || 0, strlen(each));
    });
    return next;
  }, []);

  const lines = [];
  const seperator = csv ? ' , ' : ' | ';

  // head
  if (head) {
    if (!csv) {
      lines.push(` +${colLen.map(len => Array(len + 2).fill('-').join('')).join('+')}+`);
    }
    const line = [''];
    Array(5).fill(2);
    head.forEach((col, i) => {
      const padding = Array(colLen[i] - strlen(col)).fill(' ').join('');
      if (typeof col === 'number') {
        line.push(padding + col);
      } else {
        line.push(col + padding);
      }
    });
    line.push('');
    if (csv) {
      lines.push(line.join(seperator).replace(/(^\s*,|,\s*$)/g, ''));
    } else {
      lines.push(line.join(seperator));
    }
  }
  // // head

  // body
  if (!csv) {
    lines.push(` +${colLen.map(len => Array(len + 2).fill('-').join('')).join('+')}+`);
  }
  body.forEach((cols) => {
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
    if (csv) {
      lines.push(line.join(seperator).replace(/(^\s*,|,\s*$)/g, ''));
    } else {
      lines.push(line.join(seperator));
    }
  });
  if (!csv) {
    lines.push(` +${colLen.map(len => Array(len + 2).fill('-').join('')).join('+')}+`);
  }
  // // body
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

const ask = (question) => {
  const rl = require('readline');
  const r = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
  return new Promise((resolve, error) => {
    r.question(question, (answer) => {
      r.close();
      resolve(answer);
    });
  });
};

const askHidden = (question) => {
  const rl = require('readline');
  const stdin = process.openStdin();
  const listener = (char) => {
    // eslint-disable-next-line no-param-reassign
    char += '';
    switch (char) {
      case '\n':
      case '\r':
      case '\u0004':
        stdin.pause();
        break;
      default:
        process.stdout.write('\033[2K\033[200D' + question + Array(r.line.length+1).join('*'));
        break;
    }
  };
  process.stdin.on('data', listener);
  const r = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    r.question(question, (answer) => {
      r.history = r.history.slice(1);
      r.close();
      process.stdin.removeListener('data', listener);
      resolve(answer);
    });
  });
};

exports.printTable = printTable;
exports.keysToCamelCase = keysToCamelCase;
exports.ask = ask;
exports.askHidden = askHidden;
