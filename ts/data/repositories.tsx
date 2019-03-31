// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
/*
    Consider including a TOKEN (summary) with each document for lists
*/

// repositories.tsx
let folders = {
    henrikacf:{
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
        },
        references:{
            parent:'',
            list:'',
            folder:'',
        },
        counts:{},
        system:{
            attributes:{
            },
            permissions:{
                acl:{},
                folder:'',
            },
        },
        data:{},
    }
}

let schemes = {
    somescheme:{
        identity:{
        },
        properties:{},
        references:{
            parent:{
                id:'',
                handle:'',
            },
        },
        counts:{},
        system:{},
        data:{},
    }
}

let localtypes = {
    incoming:{
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            metatype:'',
            fields:{
                links:[],
                origin:[],
                target:[],
            },
            version:0,
            map:{},
            interface:{},
            defaults:{},
            display:{},
            static:{
                is:{},
                has:{},
            }
        },
        references:{
            list:'',
            parent:{
                id:'',
                handle:'',
            },
        },
        counts:{},
        system:{
            attributes:{
            },
            permissions:{
                folder:'',
                acl:{},
            },
        },
        data:{},
    },
    outgoing: {
        identity: {
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties: {
            metatype:'',
            version:0,
            map:{},
            interface:{},
            defaults:{},
            display:{},
            static:{
                is:{
                    outgoing:true,
                },
                has:{},
            },
            fields:{},
        },
        references:{
            list:'',
            parent:{
                id:'',
                handle:'',
                account:{
                    id:'',
                    handle:'',
                },
            },
        },
        counts:{},
        system:{
            attributes:{},
            permissions:{
                folder:'',
            },
        },
        data:{},
    },
}

let lists = {
    diaries:
    {
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            class:'field',
            version:0,
            name:'Diaries',
        },
        references:{
            subscriptions:[], // {reference:[],list:''}
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{},
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
    logs:
    {
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            class:'field',
            version:0,
            name:'Logs',
        },
        references:{
            subscriptions:[], // {reference:[],list:''}
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{},
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
    notes:
    {
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
       },
        properties:{
            version:0,
            name:'Notes',
        },
        references:{
            subscriptions:[],
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{},
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
    tribes:
    {
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
            name:'Tribes',
        },
        references:{
            subscriptions:[],
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{
                sysnode:true,
            },
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
    connections:
    {
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
            name:'Contacts',
        },
        references:{
            subscriptions:[],
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{},
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
    requesting:
    {
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
            name:'Action items',
        },
        references:{
            subscriptions:[],
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{},
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
    assets:
    {
        identity:{
            container:'',
            id:'assets',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
            name:'Assets',
        },
        references:{
            subscriptions:[],
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{},
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
    roles:
    {
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
            name:'Roles',
        },
        references:{
            subscriptions:[],
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{},
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
    programs:
    {
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
            name:'Programs',
        },
        references:{
            subscriptions:[],
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{},
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
    plans:
    {
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
            name:'Plans',
        },
        references:{
            subscriptions:[],
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{},
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
    projects:
    {
        identity:{
            container:'',
            id:'outgoing',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
            name:'Projects',
        },
        references:{
            subscriptions:[],
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{},
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
    tasks:
    {
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
            name:'To do Lists',
        },
        references:{
            subscriptions:[],
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{},
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
    managedtasks:
    {
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
            name:'To do lists - Checklists',
        },
        references:{
            subscriptions:[],
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{},
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
    deeptasks:
    {
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
            name:'To do lists - Complex',
        },
        references:{
            subscriptions:[],
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{},
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
    messages:
    {
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
            name:'Messages',
        },
        references:{
            subscriptions:[],
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{},
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
    streams:
    {
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
            name:'Forums',
        },
        references:{
            subscriptions:[],
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{},
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
    resources:
    {
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
            name:'Documents',
        },
        references:{
            subscriptions:[],
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{},
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
    calendars:
    {
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
            name:'Calendars',
        },
        references:{
            subscriptions:[],
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{},
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
    timesheets:
    {
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
            name:'Timesheets',
        },
        references:{
            subscriptions:[],
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{},
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
    accounting:
    {
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
            name:'Ledgers',
        },
        references:{
            subscriptions:[],
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{},
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
    budgets:
    {
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
            name:'Budgets',
        },
        references:{
            subscriptions:[],
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{},
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
    recipes:
    {
        identity:{
            container:'',
            id:'',
            handle:'',
            types:'/types/recipes',
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
            name:'Recipes',
        },
        references:{
            subscriptions:[],
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:0,
            links:0,
        },
        system:{
            attributes:{},
            permissions:{},
        },
        data:{
            lists:[],
            links:[],
        },
    },
//     membership:
//     {
//         identity:{
//             container:'',
//             id:'',
//             handle:'',
//             type:{
//                 id:'outgoing',
//                 handle:'',
//             },
//             account:{
//                 id:'',
//                 handle:'',
//             },
//         },
//         properties:{
//             version:0,
//             name:'My Account',
//         },
//         references:{
//             subscriptions:[],
//             owner:{
//                 id:'henrik',
//                 collection:'items',
//             },
//             parentlists:[],
//             folder:'',
//         },
//         counts:{
//             lists:0,
//             links:0,
//         },
//         system:{
//             attributes:{
//                 sysnode:true,
//             },
//             permissions:{},
//         },
//         data:{
//             lists:[],
//             links:[],
//         },
// // account, website, home
//     },
    // other:
    // {
    //     identity:{
    //         container:'',
    //         id:'',
    //         handle:'',
    //         type:{
    //             id:'',
    //             handle:'',
    //         },
    //         account:{
    //             id:'',
    //             handle:'',
    //         },
    //     },
    //     properties:{
    //         version:0,
    //         name:'More...',
    //     },
    //     references:{
    //         subscriptions:[],
    //         owner:{
    //             id:'henrik',
    //             collection:'items',
    //         },
    //         parentlists:[],
    //         folder:'',
    //     },
    //     counts:{
    //         lists:0,
    //         links:0,
    //     },
    //     system:{
    //         attributes:{
    //             sysnode:true,
    //         },
    //         permissions:{},
    //     },
    //     data:{
    //         lists:[],
    //         links:[],
    //     },
    // },
    henrik:
    {
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
            name:'Types of Records',
            linkedlist:false,
        },
        references:{
            subscriptions:[],
            owner:{
                reference:'/items/henrik',
            },
            parentlists:[],
            folder:'',
        },
        counts:{
            lists:20,
            links:0,
        },
        system:{
            attributes:{
                sysnode:true,
            },
            permissions:{},
        },
        data:{
            lists:[
                // {
                //     collection:'lists',
                //     id:'membership',
                // },
                {
                    reference:'/lists/tribes',
                },
                {
                    reference:'/lists/roles',
                },
                {
                    reference:'/lists/connections',
                },
                {
                    reference:'/lists/messages',
                },
                {
                    reference:'/lists/streams',
                },
                {
                    reference:'/lists/requesting',
                },
                {
                    reference:'/lists/tasks',
                },
                // {
                //     reference:'/lists/managedtasks',
                // },
                // {
                //     reference:'/lists/deeptasks',
                // },
                {
                    reference:'/lists/projects',
                },
                {
                    reference:'/lists/programs',
                },
                {
                    reference:'/lists/plans',
                },
                {
                    reference:'/lists/calendars',
                },
                {
                    reference:'/lists/timesheets',
                },
                {
                    reference:'/lists/accounting',
                },
                {
                    reference:'/lists/budgets',
                },
                {
                    reference:'/lists/logs',
                },
                {
                    reference:'/lists/notes',
                },
                {
                    reference:'/lists/diaries',
                },
                {
                    reference:'/lists/resources',
                },
                {
                    reference:'/lists/assets',
                },
                {
                    reference:'/lists/recipes',
                },
            ],
            links:[],
        },
    },
}

let links = {
    somelink:{
        identity:{
            container:'',
            id:'',
            handle:'',
            type:null,
            account:{
                id:'',
                handle:'',
            },
        },
        properties:{
            version:0,
            startdate:null,
            enddate:null,
        },
        references:{
            lists:[],
            folder:'',
        },
        counts:{},
        system:{},
        data:{},
    }
}

let items = {
    henrik:{
        identity:{
            container:'',
            id:'',
            handle:'henrik',
            type:null,
            account:{
                id:'',
                handle:'',
            },
            version:0,
        },
        properties:{
            name:{
                honorific:'Mr.',
                firstname:'Henrik',
                lastname:'Bechmann',
                middlenames:'Emanuel',
                givenname:'Henrik',
                fullname:'Henrik Bechmann',
                fullnamecomposite:{
                    composite:true,
                    honorific:false,
                    firstname:true,
                    lastname:true,
                    middlenames:false,
                    givenname:false,
                    designations:false,
                },
                designations:'',
            },
            genderpronoun:'he',
            description:'Creator of Tribalopolis',
            birthdate:'1950-08-23',
            enddate:null,
            address:{
                unit:'',
                streetnumber:'',
                streetname:'',
                locality:'',
                region:'',
                country:'',
                locationcode:'',
                startdate:null,
                enddate:null,
            },
        },
        references:{
            chain:{
                prior:'',
                next:'',
            },
            list:'henrik',
            folder:'',
        },
        counts:{},
        system:{
            attributes:{},
            permissions:{},
        },
        data:{},
    },
}

let accounts = {
    someaccount:{
        identity:{},
        properties:{},
        references:{},
        counts:{},
        system:{},
        data:{},
    }
}

export { schemes, localtypes, items, lists, links, folders, accounts } 
