const mkdirp = require('mkdirp');
const path = require('path');

function datenum(v, date1904) {
  if (date1904) v += 1462;
  const epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheetFromArrayOfArrays(data) {
  const xlsx = require('xlsx');
  const ws = {};
  const range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
  for (let R = 0; R != data.length; ++R) {
    for (let C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      const cell = { v: data[R][C] };
      if (cell.v == null) continue;
      const cellRef = xlsx.utils.encode_cell({ c: C, r: R });
      if (typeof cell.v === 'number') {
        cell.t = 'n';
      } else if (typeof cell.v === 'boolean') {
        cell.t = 'b';
      } else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.z = xlsx.SSF._table[14];
        cell.v = datenum(cell.v);
      } else {
        cell.t = 's';
      }
      ws[cellRef] = cell;
    }
  }
  if (range.s.c < 10000000) ws['!ref'] = xlsx.utils.encode_range(range);
  return ws;
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}

const writeFile = (data, filename) => {
  const wsName = 'Sheet1';
  const wb = new Workbook();
  const ws = sheetFromArrayOfArrays(data);
  const filepath = path.join(__dirname, '..', 'xlsx', filename);
  const xlsx = require('xlsx');

  // add worksheet to workbook
  wb.SheetNames.push(wsName);
  wb.Sheets[wsName] = ws;

  // write file
  mkdirp(path.dirname(filepath), (err) => {
    if (err) throw new Error(err);
    xlsx.writeFile(wb, filepath);
  });

  return filepath;
};

exports.writeFile = writeFile;
