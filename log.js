var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            name: 'error-file',
            filename: 'error.log',
            level: 'error',
            json: true,
            handleExceptions: true,
            humanReadableUnhandledException: true,
            timestamp: function () {
                return new Date().toLocaleString()
            }
        }),
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