var router = new VueRouter();
router.map({
    '/':{
        component: performance,
        performance:true
    },
    '/performance': {
        component: performance,
        performance:true
    },
    '/pageSize': {
        component: pageSize,
        pagesize:true
    },
    '/pv':{
    	component: pv,
        pv:true
    },
    '/uv':{
        component:uv,
        uv:true
    },
    '/point':{
        component: point,
        point:true
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
    '/perform':{
        component:perform,
        perform:true
    },
    '/byPage':{
        component:byPage,
        byPage:true
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