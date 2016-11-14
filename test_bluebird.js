var q = require("bluebird");

function foo() {
    var defer = q.defer();
    process.nextTick(function () {
        defer.resolve();
    });
    return defer.promise;
}


var state = 'before foo';


foo()
.then(function onSuccess() {
    console.log('success!');
    throw new Error('unexpected error');
})
.finally(function setState() {
    state = 'foo finished';
})
.done();


process.on('exit', function () {
    console.log('on exit, state =', state);
});