var router = new VueRouter();
router.map({
    '/':{
        component: pageT,
        pageT:true
    },
    '/pageT':{
        component: pageT,
        pageT:true
    },
    '/totalV':{
        component:totalV,
        totalV:true
    },
    '/browser':{
        component: browser,
        browser:true
    },
    '/platform':{
        component:platform,
        platform:true
    },
    '/hourPeak':{
        component:hourPeak,
        hourPeak:true
    },
    '/performance':{
        component:performance,
        performance:true
    },
    '/pageV':{
        component:pageV,
        pageV:true
    },
    '/spec':{
        component:spec,
        spec:true
    },
    '/custom':{
        component:custom,
        custom:true
    }
})