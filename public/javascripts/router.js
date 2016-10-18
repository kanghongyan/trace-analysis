var router = new VueRouter();
router.map({
    '/':{
        component: point,
        point:true
    },
    '/point':{
        component: point,
        point:true
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