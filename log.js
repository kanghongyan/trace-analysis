var winston = require('winston');
var fs = require( 'fs' );
var path = require('path');
require('winston-daily-rotate-file');

var logDir = path.resolve(__dirname, './logs');

if ( !fs.existsSync( logDir ) ) {
    fs.mkdirSync( logDir );
}

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.DailyRotateFile)({
            name: 'error-file',
            filename: logDir + '/error.log',
            datePattern: 'yyyy-MM-dd.', // eg:2018-01-06.error.log
            prepend: true,
            level: 'error',
            json: true,
            handleExceptions: true,
            humanReadableUnhandledException: true,
            timestamp: function () {
                return new Date().toLocaleString()
            }
        })
        // new (winston.transports.File)({
        //     name: 'info-file',
        //     filename: 'normal.log',
        //     level: 'info',
        // })
    ],
    exitOnError: false
});

module.exports = {
    error: logger.error
};