const fs = require('fs');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const path = require('path');
const Handlebars = require('handlebars');
const tplPath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());
const conf = require('../config/defaultConfig');
const mime = require('./mime');
const compress = require('./compress');

module.exports = async function (req, res, filePath) {
    try {
        const stats = await stat(filePath);
        if (stats.isFile()) {
            res.statusCode = 200;
            const contentType = mime(filePath);
            res.setHeader('Content-Type', contentType);
            let rs = fs.createReadStream(filePath);
            if(filePath.match(conf.compress)){
                rs = compress(rs, req, res);
            }
            rs.pipe(res);
        } else if (stats.isDirectory()) {
            const files = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            const dir = path.relative(conf.root, filePath);
            const data = {
                title: path.basename(filePath),
                dir: dir ? dir : '',
                files: files.map(file => {
                    return {
                        file,
                        type: mime(filePath),
                    }
                })
            }
            res.end(template(data));
        }
    } catch (ex) {
        console.error(ex);
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`${filePath} is not a file or folder/n ${ex.toString()}`);
    }
}