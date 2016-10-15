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
    '/xv':{
        component:xv,
        xv:true
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