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
    '/constant':{
        component:constant,
        constant:true
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