/*
    Consider including a TOKEN (summary) with each document for lists
*/

// repositories.tsx
let folders = {
    henrikacf:{
        system:{
            attributes:{

            },
            permissions:{
                owner:'henrikaccount',
                acl:{}
            },
        },
        type:{

        },
        identity:{

        },
        properties:{
        },
        list:{},
        generations:{
            meta:0,
            properties:0,
        },
        counts:{},
    }
}

let schemes = {
}

let types = {
    incoming:{
        system:{
            attributes:{

            },
            permissions:{
                owner:'henrikaccount',
                acf:'henrikacf',
                acl:{}
            },
        },
        type:{

        },
        identity:{

        },
        properties:{
            is:{},
            has:{},
        },
        list:{},
        generations:{
            meta:0,
            properties:0,
        },
        counts:{},
    },
    outgoing: {
        system:{
            attributes:{

            },
            permissions:{

            },
        },
        type:{

        },
        identity: {

        },
        properties: {
            is:{
                outgoing:true,
            },
            has:{},
        },
        list:{},
        generations:{
            meta:0,
            properties:0,
        },
        counts:{},
    },
}

let lists = {
    diaries:
    {
        system:{
            attributes:{

            },
            permissions:{

            },
        },
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Diaries',
        },
        lists:[],
        items:[],
        item:{
            repo:'items',
            uid:'henrik',
        },
        generations:{
            meta:0,
            properties:0,
        },
        counts:{
            lists:0,
            items:0,
        },
        itemuid:'henrik',
        subscriptions:{
            ['subscriptionid']:{
                lastreadstamp:1,
                recentcreatecount:5,
                recenttokens:[], // queue
            }
        },
        subscribers: {

        },
    },
    notes:
    {
        system:{
            attributes:{

            },
            permissions:{

            },
        },
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        identity:{
             uid:'x',
       },
        properties:{
            name:'Notes',
        },
        lists:[],
        items:[],
        item:{
            repo:'items',
            uid:'henrik',
        },
        generations:{
            meta:0,
            properties:0,
        },
        counts:{
            lists:0,
            items:0,
        },
        subscriptions:{

        },
        subscribers: {

        },
    },
    tribes:
    {
        system:{
            attributes:{
                sysnode:true,
            },
            permissions:{

            },
        },
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Tribes',
        },
        lists:[],
        items:[],
        generations:{
            meta:0,
            properties:0,
        },
        counts:{
            lists:0,
            items:0,
        },
        item:{
            repo:'items',
            uid:'henrik',
        },
        subscriptions:{

        },
        subscribers: {

        },
    },
    connections:
    {
        system:{
            attributes:{

            },
            permissions:{

            },
        },
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Contacts',
        },
        lists:[],
        items:[],
        generations:{
            meta:0,
            properties:0,
        },
        counts:{
            lists:0,
            items:0,
        },
        item:{
            repo:'items',
            uid:'henrik',
        },
        subscriptions:{

        },
        subscribers: {

        },
    },
    requesting:
    {
        system:{
            attributes:{

            },
            permissions:{

            },
        },
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Outgoing action requests',
        },
        lists:[],
        items:[],
        generations:{
            meta:0,
            properties:0,
        },
        counts:{
            lists:0,
            items:0,
        },
        item:{
            repo:'items',
            uid:'henrik',
        },
        subscriptions:{

        },
        subscribers: {

        },
    },
    pending:
    {
        system:{
            attributes:{

            },
            permissions:{

            },
        },
        type:{
            uid:'incoming',
            schemeuid:'common',
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Incoming action requests',
        },
        lists:[],
        items:[],
        generations:{
            meta:0,
            properties:0,
        },
        counts:{
            lists:0,
            items:0,
        },
        item:{
            repo:'items',
            uid:'henrik',
        },
        subscriptions:{

        },
        subscribers: {

        },
    },
    roles:
    {
        system:{
            attributes:{

            },
            permissions:{

            },
        },
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Roles',
        },
        lists:[],
        items:[],
        generations:{
            meta:0,
            properties:0,
        },
        counts:{
            lists:0,
            items:0,
        },
        item:{
            repo:'items',
            uid:'henrik',
        },
        subscriptions:{

        },
        subscribers: {

        },
    },
    programs:
    {
        system:{
            attributes:{

            },
            permissions:{

            },
        },
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Programs',
        },
        lists:[],
        items:[],
        generations:{
            meta:0,
            properties:0,
        },
        counts:{
            lists:0,
            items:0,
        },
        item:{
            repo:'items',
            uid:'henrik',
        },
        subscriptions:{

        },
        subscribers: {

        },
    },
    projects:
    {
        system:{
            attributes:{

            },
            permissions:{

            },
        },
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Projects',
        },
        lists:[],
        items:[],
        generations:{
            meta:0,
            properties:0,
        },
        counts:{
            lists:0,
            items:0,
        },
        item:{
            repo:'items',
            uid:'henrik',
        },
        subscriptions:{

        },
        subscribers: {

        },
    },
    tasks:
    {
        system:{
            attributes:{

            },
            permissions:{

            },
        },
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Tasks',
        },
        lists:[],
        items:[],
        generations:{
            meta:0,
            properties:0,
        },
        counts:{
            lists:0,
            items:0,
        },
        item:{
            repo:'items',
            uid:'henrik',
        },
        subscriptions:{

        },
        subscribers: {

        },
    },
    messages:
    {
        system:{
            attributes:{

            },
            permissions:{

            },
        },
        type:{
            uid:'incoming',
            schemeuid:'common',
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Direct Messages ',
        },
        lists:[],
        items:[],
        generations:{
            meta:0,
            properties:0,
        },
        counts:{
            lists:0,
            items:0,
        },
        item:{
            repo:'items',
            uid:'henrik',
        },
        subscriptions:{

        },
        subscribers: {

        },
    },
    streams:
    {
        system:{
            attributes:{

            },
            permissions:{

            },
        },
        type:{
            uid:'incoming',
            schemeuid:'common',
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Message Streams ',
        },
        lists:[],
        items:[],
        generations:{
            meta:0,
            properties:0,
        },
        counts:{
            lists:0,
            items:0,
        },
        item:{
            repo:'items',
            uid:'henrik',
        },
        subscriptions:{

        },
        subscribers: {

        },
    },
    resources:
    {
        system:{
            attributes:{

            },
            permissions:{

            },
        },
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Resources',
        },
        lists:[],
        items:[],
        generations:{
            meta:0,
            properties:0,
        },
        counts:{
            lists:0,
            items:0,
        },
        item:{
            repo:'items',
            uid:'henrik',
        },
        subscriptions:{

        },
        subscribers: {

        },
    },
    calendars:
    {
        system:{
            attributes:{

            },
            permissions:{

            },
        },
        type:{
            uid:'incoming',
            schemeuid:'common',
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Calendars',
        },
        lists:[],
        items:[],
        generations:{
            meta:0,
            properties:0,
        },
        counts:{
            lists:0,
            items:0,
        },
        item:{
            repo:'items',
            uid:'henrik',
        },
        subscriptions:{

        },
        subscribers: {

        },
    },
    accounting:
    {
        system:{
            attributes:{

            },
            permissions:{

            },
        },
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Accounting',
        },
        lists:[],
        items:[],
        generations:{
            meta:0,
            properties:0,
        },
        counts:{
            lists:0,
            items:0,
        },
        item:{
            repo:'items',
            uid:'henrik',
        },
        subscriptions:{

        },
        subscribers: {

        },
    },
    membership:
    {
        system:{
            attributes:{
                sysnode:true,
            },
            permissions:{

            },
        },
        type:{
            uid:'incoming',
            schemeuid:'common',
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Tribalopolis Membership',
        },
        lists:[],
        items:[],
        generations:{
            meta:0,
            properties:0,
        },
        counts:{
            lists:0,
            items:0,
        },
        item:{
            repo:'items',
            uid:'henrik',
        },
        subscriptions:{

        },
        subscribers: {

        },
// account, website, home
    },
    other:
    {
        system:{
            attributes:{
                sysnode:true,
            },
            permissions:{

            },
        },
        type:{
            uid:'incoming',
            schemeuid:'common',
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'More...',
        },
        lists:[],
        items:[],
        generations:{
            meta:0,
            properties:0,
        },
        counts:{
            lists:0,
            items:0,
        },
        item:{
            repo:'items',
            uid:'henrik',
        },
        subscriptions:{

        },
        subscribers: {

        },
    },
    henrik:
    {
        system:{
            attributes:{
                sysnode:true,
            },
            permissions:{

            },
        },
        type:{
            uid:'incoming',
            schemeuid:'common',
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Links Directory',
            linkedlist:false,
        },
        lists:[
            {
                repo:'lists',
                uid:'membership',
            },
            {
                repo:'lists',
                uid:'tribes',
            },
            {
                repo:'lists',
                uid:'connections',
            },
            {
                repo:'lists',
                uid:'requesting',
            },
            {
                repo:'lists',
                uid:'pending',
            },
            {
                repo:'lists',
                uid:'diaries',
            },
            {
                repo:'lists',
                uid:'notes',
            },
            {
                repo:'lists',
                uid:'tasks',
            },
            {
                repo:'lists',
                uid:'messages',
            },
            {
                repo:'lists',
                uid:'streams',
            },
            {
                repo:'lists',
                uid:'calendars',
            },
            {
                repo:'lists',
                uid:'accounting',
            },
            {
                repo:'lists',
                uid:'roles',
            },
            {
                repo:'lists',
                uid:'programs',
            },
            {
                repo:'lists',
                uid:'projects',
            },
            {
                repo:'lists',
                uid:'resources',
            },
            {
                repo:'lists',
                uid:'other',
            },
        ],
        items:[],
        item:{
            repo:'items',
            uid:'henrik',
        },
        generations:{
            meta:0,
            properties:0,
        },
        counts:{
            lists:17,
            items:0,
        },
        subscriptions:{

        },
        subscribers: {

        },
    },
}

let links = {}

let items = {
    henrik:{
        system:{
            attributes:{

            },
            permissions:{

            },
        },
        type:{
            uid:'incoming',
            name:'member', // TODO: should be obtained from type object
            schemeuid:'common',
        },
        identity:{
            uid:'henrik',
            account:'henrik',
            alias:'henrik',
        },
        properties:{
            tag:'Henrik',
            name:'Henrik Bechmann',
            title:null,
            description:'Creator of Tribalopolis',
            birthdate:'1950-08-23',
            location:'Toronto',
            locationid:'Toronto',
        },
        list:{repo:'lists',uid:'henrik'},
        generations:{
            meta:0,
            properties:0,
        },
        counts:{},
    },
}

let accounts = {

}

// let subscriptions = {
//     subscriber:{

//     },
//     subscription:{
//         startpoint:{

//         },
//         path:[

//         ],
//         endpoint: {

//         },
//     }
// }

export { schemes, types, items, lists, links, folders, accounts } //, subscriptions }
