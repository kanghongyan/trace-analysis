var router = new VueRouter();
router.map({
//  '/':{
//      component: pageT,
//      pageT:true
//  },
    '/pageT':{
        component: pageT,
        pageT:true
    },
    '/totalV':{
        component:totalV,
        totalV:true
    },
    '/pageV':{
        component:pageV,
        pageV:true
    },
    
    
    
    '/performance':{
        component:performance,
        performance:true
    },
    '/browser':{
        component: browser,
        browser:true
    },
    '/platform':{
        component:platform,
        platform:true
    },
    '/screenSize':{
        component:screenSize,
        screenSize:true
    },
    
    
    
    '/hourPeak':{
        component:hourPeak,
        hourPeak:true
    },
    '/urlFilter':{
        component:urlFilter,
        urlFilter:true
    },
    
    
    
    '/specDaoliuPortal':{
        component:specDaoliuPortal,
        specDaoliuPortal:true
    },


    '/refer': {
        component: refer,
        refer: true
    },


    '/sendBeacon': {
        component: sendBeacon,
        sendBeacon: true
    },
    
    '/loadAverage': {
        component: loadAverage,
        loadAverage: true
    }
})