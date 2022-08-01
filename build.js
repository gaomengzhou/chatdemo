const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const dateFns = require('date-fns');

let version = '';
if (fs.existsSync('./version.txt')) {
  version = fs.readFileSync('./version.txt', { encoding: 'utf-8' });
  if (typeof version == 'string') {
    if (!(version.startsWith('RLS_') || version.startsWith('DEV_')))
      version = '';
    else version = version.replace(/[\n,\r\n]/g, '');
  }
}

const versionEnv =
  version ||
  `PROD_${dateFns.format(new Date(), 'yyyyMMdd|HHmm')}`.replace('|', 'T');
const packageEnv = dateFns
  .format(new Date(), 'yyyyMMdd|HHmm')
  .replace('|', 'T');

const opts = { encoding: 'UTF-8' };
const rootPath = path.resolve(__dirname, '');
const h5Path = path.resolve(rootPath, 'dist/index.html');
const pcPath = path.resolve(rootPath, 'dist/index.html');
const appPath = path.resolve(rootPath, 'public/temp.html');

const h5 = fs.readFileSync(h5Path, opts);
const pc = fs.readFileSync(pcPath, opts);
let app = fs.readFileSync(appPath, opts);

fs.copyFileSync(h5Path, path.resolve(rootPath, 'dist/h5.html'));
fs.copyFileSync(pcPath, path.resolve(rootPath, 'dist/pc.html'));
fs.copyFileSync(h5Path, path.resolve(rootPath, 'dist/h5.template.html'));
fs.copyFileSync(pcPath, path.resolve(rootPath, 'dist/pc.template.html'));

let $;
$ = cheerio.load(h5);
app = app.replace('@H5_HEAD_HTML@', encodeURI($('head').html()));
app = app.replace('@H5_BODY_HTML@', encodeURI($('body').html()));

$ = cheerio.load(pc);
app = app.replace('@PC_HEAD_HTML@', encodeURI($('head').html()));
app = app.replace('@PC_BODY_HTML@', encodeURI($('body').html()));

app = app.replace('@VERSION@', versionEnv).replace('@PACKAGE@', packageEnv);

fs.writeFileSync(path.resolve(rootPath, 'dist/index.template.html'), app, {
  encoding: 'UTF-8',
});
