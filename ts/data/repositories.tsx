// workspacedata.tsx
import {serializer} from '../core/utilities/serializer'

let maps = {
    schemes:{
        common:{
            tribe:'tribalopolis',
            parent:null,
        }
    },
}

let schemes = {
    common:{
        list:{

        },
        item:{

        },
        link:{

        },
    },
}

let types = {
    list:{
        common:{
            __default__:{
                type:{

                },
                metadata: {
                    uid:null,
                    schemeuid:null,
                },
                identity:{

                },
                properties:{
                    is:{},
                    has:{},
                },
            },
            outgoing: {
                type:{

                },
                metadata: {
                    uid:null,
                    schemeuid:null,
                },
                identity: {

                },
                properties: {
                    is:{
                        outgoing:true,
                    },
                    has:{},
                },
            },
        },
    },
    item:{

    },
    link:{

    },
}

let lists = {
    diaries:
    {
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        metadata: {
            uid:null,
            schemeuid:null,
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Diaries',
            aggregates:{
                childcount:{
                    amount:3,
                    timestamp:1
                },
            },
        },
        links:[],
    },
    notes:
    {
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        metadata: {
            uid:null,
            schemeuid:null,
        },
        identity:{
             uid:'x',
       },
        properties:{
            name:'Notes',
            aggregates:{
                childcount:{
                    amount:310,
                    timestamp:1
                },
            },
        },
        links:[],
    },
    tribes:
    {
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        metadata: {
            uid:null,
            schemeuid:null,
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Tribes',
            sysnode:true,
            aggregates:{
                childcount:{
                    amount:5,
                    timestamp:1
                },
            },
        },
        links:[],
    },
    connections:
    {
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        metadata: {
            uid:null,
            schemeuid:null,
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Contacts',
            aggregates:{
                childcount:{
                    amount:23,
                    timestamp:1
                },
            },
        },
        links:[],
    },
    requesting:
    {
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        metadata: {
            uid:null,
            schemeuid:null,
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Outgoing action requests',
            aggregates:{
                childcount:{
                    amount:12,
                    timestamp:1
                },
            },
        },
        links:[],
    },
    pending:
    {
        type:{
            uid:'pending',
            schemeuid:'common',
        },
        metadata: {
            uid:null,
            schemeuid:null,
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Incoming action requests',
            aggregates:{
                childcount:{
                    amount:23,
                    timestamp:1
                },
            },
        },
        links:[],
    },
    roles:
    {
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        metadata: {
            uid:null,
            schemeuid:null,
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Roles',
            aggregates:{
                childcount:{
                    amount:4,
                    timestamp:1
                },
            },
        },
        links:[],
    },
    programs:
    {
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        metadata: {
            uid:null,
            schemeuid:null,
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Programs',
            aggregates:{
                childcount:{
                    amount:5,
                    timestamp:1
                },
            },
        },
        links:[],
    },
    projects:
    {
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        metadata: {
            uid:null,
            schemeuid:null,
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Projects',
            aggregates:{
                childcount:{
                    amount:3,
                    timestamp:1
                },
            },
        },
        links:[],
    },
    tasks:
    {
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        metadata: {
            uid:null,
            schemeuid:null,
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Tasks',
            aggregates:{
                childcount:{
                    amount:20,
                    timestamp:1
                },
            },
        },
        links:[],
    },
    messages:
    {
        type:{
            uid:'messengers',
            schemeuid:'common',
        },
        metadata: {
            uid:null,
            schemeuid:null,
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Direct Messages ',
            aggregates:{
                childcount:{
                    amount:3,
                    timestamp:1
                },
            },
        },
        links:[],
    },
    streams:
    {
        type:{
            type:'messengers',
            schemeuid:'common',
        },
        metadata: {
            uid:null,
            schemeuid:null,
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Message Streams ',
            aggregates:{
                childcount:{
                    amount:100,
                    timestamp:1
                },
            },
        },
        links:[],
    },
    resources:
    {
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        metadata: {
            uid:null,
            schemeuid:null,
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Resources',
            aggregates:{
                childcount:{
                    amount:64,
                    timestamp:1
                },
            },
        },
        links:[],
    },
    calendars:
    {
        type:{
            uid:'calendars',
            schemeuid:'common',
        },
        metadata: {
            uid:null,
            schemeuid:null,
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Calendars',
            aggregates:{
                childcount:{
                    amount:67,
                    timestamp:1
                },
            },
        },
        links:[],
    },
    accounting:
    {
        type:{
            uid:'outgoing',
            schemeuid:'common',
        },
        metadata: {
            uid:null,
            schemeuid:null,
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Accounting',
            aggregates:{
                childcount:{
                    amount:6000,
                    timestamp:1
                },
            },
        },
        links:[],
    },
    membership:
    {
        type:{
            uid:'other',
            schemeuid:'common',
        },
        metadata: {
            uid:null,
            schemeuid:null,
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Tribalopolis Membership',
            sysnode:true,
            aggregates:{
                childcount:{
                    amount:2,
                    timestamp:1
                },
            },
        },
        links:[],
// account, website, home
    },
    other:
    {
        type:{
            uid:'other',
            schemeuid:'common',
        },
        metadata: {
            uid:null,
            schemeuid:null,
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'More...',
            sysnode:true,
            aggregates:{
                childcount:{
                    amount:2,
                    timestamp:1
                },
            },
        },
        links:[],
    },
    henrik:
    {
        type:{
            uid:'member',
            schemeuid:'common',
        },
        metadata: {
            uid:null,
            schemeuid:null,
        },
        identity:{
            uid:'x',
        },
        properties:{
            name:'Links Directory',
            sysnode:true,
            aggregates:{
                childcount:{
                    amount:6558,
                    timestamp:1
                },
            },
        },
        links:[
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
    },
}

let links = {}

let items = {
    henrik:{
        type:{
            uid:'member',
            name:'member', // TODO: should be obtained from type object
            schemeuid:'common',
        },
        metadata: {
            uid:null,
            schemeuid:null,
        },
        identity:{
            uid:'henrik',
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
        listref:{repo:'lists',uid:'henrik'},
    },
}

let datastacks = [ // four quadrant stacks
    [ // each quadrant stack
        { // each quadrant stack layer
            items:[ // items in the stack layer
                {
                    dataref:{
                        repo:'items',
                        uid:'henrik',
                    },
                    instanceid:serializer.getid(),
                    liststack:[],
                    settings:{
                    },
                },
            ],
            source: {},
            settings:{
            },
        },
    ],
    [
        {
            items:[
                {
                    dataref:{
                        repo:'items',
                        uid:'henrik',
                    },
                    instanceid:serializer.getid(),
                    liststack:[],
                    settings:{},
                },
            ],
            source:{
            },
            settings:{
            },
        },
    ],
    [
        {
            items:[
                {
                    dataref:{
                        repo:'items',
                        uid:'henrik',
                    },
                    instanceid:serializer.getid(),
                    liststack:[],
                    settings:{

                    },
                },
            ],
            source: {
            },
            settings:{

            },
        },
    ],
    [
        {
            items:[
                {
                    dataref:{
                        repo:'items',
                        uid:'henrik',
                    },
                    instanceid:serializer.getid(),
                    liststack:[],
                    settings:{},
                },
            ],
            source: {
            },
            settings:{

            },
        },
    ]
]

export {lists, links, items, types, schemes, datastacks, maps}