var compute_logic_callback = require('../backend/route_specDaoliuPortal');



process.on('message', function(settings) {
    
    compute_logic_callback(settings)
    .then(function(d){
        process.send(d);
    })
    .catch(function(e){
        process.send([])
    });
})


