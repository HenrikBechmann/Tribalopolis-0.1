/*
    Consider including a TOKEN (summary) with each document for lists
*/
// repositories.tsx
let folders = {
    henrikacf: {
        identity: {
            container: '',
            id: '',
            handle: '',
            type: {
                id: '',
                handle: '',
            },
            account: {
                id: '',
                handle: '',
            },
        },
        properties: {
            version: 0,
        },
        references: {
            parent: '',
            list: '',
            folder: '',
        },
        counts: {},
        system: {
            attributes: {},
            permissions: {
                acl: {},
                folder: '',
            },
        },
        data: {},
    }
};
let schemes = {
    somescheme: {
        identity: {},
        properties: {},
        references: {
            parent: {
                id: '',
                handle: '',
            },
        },
        counts: {},
        system: {},
        data: {},
    }
};
let types = {
    incoming: {
        identity: {
            container: '',
            id: '',
            handle: '',
            type: {
                id: '',
                handle: '',
            },
            account: {
                id: '',
                handle: '',
            },
        },
        properties: {
            metatype: '',
            fields: {
                links: [],
                origin: [],
                target: [],
            },
            version: 0,
            map: {},
            interface: {},
            defaults: {},
            display: {},
            static: {
                is: {},
                has: {},
            }
        },
        references: {
            list: '',
            parent: {
                id: '',
                handle: '',
            },
        },
        counts: {},
        system: {
            attributes: {},
            permissions: {
                folder: '',
                acl: {},
            },
        },
        data: {},
    },
    outgoing: {
        identity: {
            container: '',
            id: '',
            handle: '',
            type: {
                id: '',
                handle: '',
            },
            account: {
                id: '',
                handle: '',
            },
        },
        properties: {
            metatype: '',
            version: 0,
            map: {},
            interface: {},
            defaults: {},
            display: {},
            static: {
                is: {
                    outgoing: true,
                },
                has: {},
            },
            fields: {},
        },
        references: {
            list: '',
            parent: {
                id: '',
                handle: '',
                account: {
                    id: '',
                    handle: '',
                },
            },
        },
        counts: {},
        system: {
            attributes: {},
            permissions: {
                folder: '',
            },
        },
        data: {},
    },
};
let lists = {
    diaries: {
        identity: {
            container: '',
            id: '',
            handle: '',
            type: {
                id: 'outgoing',
                handle: '',
            },
            account: {
                id: '',
                handle: '',
            },
        },
        properties: {
            class: 'field',
            version: 0,
            name: 'Diaries',
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
            folder: '',
        },
        counts: {
            lists: 0,
            links: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            links: [],
        },
    },
    notes: {
        identity: {
            container: '',
            id: '',
            handle: '',
            type: {
                id: 'outgoing',
                handle: '',
            },
            account: {
                id: '',
                handle: '',
            },
        },
        properties: {
            version: 0,
            name: 'Notes',
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
            folder: '',
        },
        counts: {
            lists: 0,
            links: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            links: [],
        },
    },
    tribes: {
        identity: {
            container: '',
            id: '',
            handle: '',
            type: {
                id: 'outgoing',
                handle: '',
            },
            account: {
                id: '',
                handle: '',
            },
        },
        properties: {
            version: 0,
            name: 'Tribes',
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
            folder: '',
        },
        counts: {
            lists: 0,
            links: 0,
        },
        system: {
            attributes: {
                sysnode: true,
            },
            permissions: {},
        },
        data: {
            lists: [],
            links: [],
        },
    },
    connections: {
        identity: {
            container: '',
            id: '',
            handle: '',
            type: {
                id: 'outgoing',
                handle: '',
            },
            account: {
                id: '',
                handle: '',
            },
        },
        properties: {
            version: 0,
            name: 'Contacts',
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
            folder: '',
        },
        counts: {
            lists: 0,
            links: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            links: [],
        },
    },
    requesting: {
        identity: {
            container: '',
            id: '',
            handle: '',
            type: {
                id: '',
                handle: '',
            },
            account: {
                id: '',
                handle: '',
            },
        },
        properties: {
            version: 0,
            name: 'Outgoing action requests',
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
            folder: '',
        },
        counts: {
            lists: 0,
            links: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            links: [],
        },
    },
    pending: {
        identity: {
            container: '',
            id: 'outgoing',
            handle: '',
            type: {
                id: '',
                handle: '',
            },
            account: {
                id: '',
                handle: '',
            },
        },
        properties: {
            version: 0,
            name: 'Incoming action requests',
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
            folder: '',
        },
        counts: {
            lists: 0,
            links: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            links: [],
        },
    },
    roles: {
        identity: {
            container: '',
            id: '',
            handle: '',
            type: {
                id: 'outgoing',
                handle: '',
            },
            account: {
                id: '',
                handle: '',
            },
        },
        properties: {
            version: 0,
            name: 'Roles',
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
            folder: '',
        },
        counts: {
            lists: 0,
            links: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            links: [],
        },
    },
    programs: {
        identity: {
            container: '',
            id: '',
            handle: '',
            type: {
                id: 'outgoing',
                handle: '',
            },
            account: {
                id: '',
                handle: '',
            },
        },
        properties: {
            version: 0,
            name: 'Programs',
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
            folder: '',
        },
        counts: {
            lists: 0,
            links: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            links: [],
        },
    },
    projects: {
        identity: {
            container: '',
            id: 'outgoing',
            handle: '',
            type: {
                id: '',
                handle: '',
            },
            account: {
                id: '',
                handle: '',
            },
        },
        properties: {
            version: 0,
            name: 'Projects',
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
            folder: '',
        },
        counts: {
            lists: 0,
            links: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            links: [],
        },
    },
    tasks: {
        identity: {
            container: '',
            id: '',
            handle: '',
            type: {
                id: 'outgoing',
                handle: '',
            },
            account: {
                id: '',
                handle: '',
            },
        },
        properties: {
            version: 0,
            name: 'To Do Lists',
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
            folder: '',
        },
        counts: {
            lists: 0,
            links: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            links: [],
        },
    },
    messages: {
        identity: {
            container: '',
            id: '',
            handle: '',
            type: {
                id: '',
                handle: '',
            },
            account: {
                id: '',
                handle: '',
            },
        },
        properties: {
            version: 0,
            name: 'Messages',
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
            folder: '',
        },
        counts: {
            lists: 0,
            links: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            links: [],
        },
    },
    streams: {
        identity: {
            container: '',
            id: '',
            handle: '',
            type: {
                id: '',
                handle: '',
            },
            account: {
                id: '',
                handle: '',
            },
        },
        properties: {
            version: 0,
            name: 'Chat Rooms',
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
            folder: '',
        },
        counts: {
            lists: 0,
            links: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            links: [],
        },
    },
    resources: {
        identity: {
            container: '',
            id: '',
            handle: '',
            type: {
                id: 'outgoing',
                handle: '',
            },
            account: {
                id: '',
                handle: '',
            },
        },
        properties: {
            version: 0,
            name: 'Resources',
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
            folder: '',
        },
        counts: {
            lists: 0,
            links: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            links: [],
        },
    },
    calendars: {
        identity: {
            container: '',
            id: '',
            handle: '',
            type: {
                id: 'outgoing',
                handle: '',
            },
            account: {
                id: '',
                handle: '',
            },
        },
        properties: {
            version: 0,
            name: 'Calendars',
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
            folder: '',
        },
        counts: {
            lists: 0,
            links: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            links: [],
        },
    },
    accounting: {
        identity: {
            container: '',
            id: '',
            handle: '',
            type: {
                id: 'outgoing',
                handle: '',
            },
            account: {
                id: '',
                handle: '',
            },
        },
        properties: {
            version: 0,
            name: 'Accounting',
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
            folder: '',
        },
        counts: {
            lists: 0,
            links: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            links: [],
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
    henrik: {
        identity: {
            container: '',
            id: '',
            handle: '',
            type: {
                id: '',
                handle: '',
            },
            account: {
                id: '',
                handle: '',
            },
        },
        properties: {
            version: 0,
            name: 'Links',
            linkedlist: false,
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
            folder: '',
        },
        counts: {
            lists: 16,
            links: 0,
        },
        system: {
            attributes: {
                sysnode: true,
            },
            permissions: {},
        },
        data: {
            lists: [
                // {
                //     repo:'lists',
                //     uid:'membership',
                // },
                {
                    repo: 'lists',
                    uid: 'tribes',
                },
                {
                    repo: 'lists',
                    uid: 'tasks',
                },
                {
                    repo: 'lists',
                    uid: 'projects',
                },
                {
                    repo: 'lists',
                    uid: 'programs',
                },
                {
                    repo: 'lists',
                    uid: 'messages',
                },
                {
                    repo: 'lists',
                    uid: 'streams',
                },
                {
                    repo: 'lists',
                    uid: 'connections',
                },
                {
                    repo: 'lists',
                    uid: 'requesting',
                },
                {
                    repo: 'lists',
                    uid: 'pending',
                },
                {
                    repo: 'lists',
                    uid: 'diaries',
                },
                {
                    repo: 'lists',
                    uid: 'notes',
                },
                {
                    repo: 'lists',
                    uid: 'calendars',
                },
                {
                    repo: 'lists',
                    uid: 'accounting',
                },
                {
                    repo: 'lists',
                    uid: 'roles',
                },
                {
                    repo: 'lists',
                    uid: 'resources',
                },
            ],
            links: [],
        },
    },
};
let links = {
    somelink: {
        identity: {
            container: '',
            id: '',
            handle: '',
            type: {
                id: '',
                handle: '',
            },
            account: {
                id: '',
                handle: '',
            },
        },
        properties: {
            version: 0,
            startdate: null,
            enddate: null,
        },
        references: {
            lists: [],
            folder: '',
        },
        counts: {},
        system: {},
        data: {},
    }
};
let items = {
    henrik: {
        identity: {
            container: '',
            id: '',
            handle: 'henrik',
            type: {
                id: '',
                handle: 'person',
            },
            account: {
                id: '',
                handle: '',
            },
        },
        properties: {
            version: 0,
            name: {
                honorific: 'Mr.',
                firstname: 'Henrik',
                lastname: 'Bechmann',
                middlenames: 'Emanuel',
                givenname: 'Henrik',
                fullname: 'Henrik Bechmann',
                fullnamecomposite: {
                    composite: true,
                    honorific: false,
                    firstname: true,
                    lastname: true,
                    middlenames: false,
                    givenname: false,
                    designations: false,
                },
                designations: '',
            },
            genderpronoun: 'he',
            description: 'Creator of Tribalopolis',
            birthdate: '1950-08-23',
            enddate: null,
            address: {
                unit: '',
                streetnumber: '',
                streetname: '',
                locality: '',
                region: '',
                country: '',
                locationcode: '',
                startdate: null,
                enddate: null,
            },
        },
        references: {
            chain: {
                prior: '',
                next: '',
            },
            list: 'henrik',
            folder: '',
        },
        counts: {},
        system: {
            attributes: {},
            permissions: {},
        },
        data: {},
    },
};
let accounts = {
    someaccount: {
        identity: {},
        properties: {},
        references: {},
        counts: {},
        system: {},
        data: {},
    }
};
export { schemes, types, items, lists, links, folders, accounts };
//# sourceMappingURL=repositories.jsx.map