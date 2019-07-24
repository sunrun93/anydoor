const http = require('http');
const chalk = require('chalk');
const conf = require('./config/defaultConfig');
const path = require('path');
const router = require('./helper/router');

class Server {
  constructor(config) {
    this.conf = Object.assign({}, conf, config);
  }

  start() {
    const server = http.createServer((req, res) => {
      const filePath = path.join(this.conf.root, req.url);
      router(req, res, filePath, this.conf);
    });

    server.listen(this.conf.port, this.conf.hostname, () => {
      const addr = `http://${this.conf.hostname}:${this.conf.port}`;
      console.log(`Server is running at ${chalk.green(addr)}`);
    });
  }
}

module.exports = Server;
