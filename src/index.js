const yargs = require('yargs');
const Server = require('./app');

const argv = yargs
    .usage('anywhere [options]')
    .option('p',{
        alias:'port',
        descripe:'端口号',
        default:9527
    })
    .option('h',{
        alias:'hostname',
        descripe:'host',
        default: '127.0.0.1'
    })
    .option('d',{
        alias:'root',
        descripe:'root path',
        default: process.cwd()
    })
    .version()
    .alias('v','version')
    .help()
    .argv;

    const server = new Server(argv);
    server.start();