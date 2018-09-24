/*
    Consider including a TOKEN (summary) with each document for lists
*/
// repositories.tsx
let folders = {
    henrikacf: {
        system: {
            attributes: {},
            permissions: {
                owner: 'henrikaccount',
                acl: {}
            },
        },
        type: {},
        identity: {},
        properties: {},
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {},
        references: {
            list: {},
            parents: [],
            account: null,
        },
    }
};
let schemes = {};
let types = {
    incoming: {
        system: {
            attributes: {},
            permissions: {
                owner: 'henrikaccount',
                acf: 'henrikacf',
                acl: {}
            },
        },
        type: {},
        identity: {},
        properties: {
            is: {},
            has: {},
        },
        list: {},
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {},
        references: {
            parents: [],
            account: null,
        },
    },
    outgoing: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {},
        identity: {},
        properties: {
            is: {
                outgoing: true,
            },
            has: {},
        },
        list: {},
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {},
        references: {
            parents: [],
            account: null,
        },
    },
};
let lists = {
    diaries: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Diaries',
        },
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            lists: [],
            items: [],
            parents: [],
            account: null,
            item: 'henrik',
            subscriptions: {
                ['subscriptionid']: {
                    lastreadstamp: 1,
                    recentcreatecount: 5,
                    recenttokens: [],
                }
            },
            subscribers: {},
        },
    },
    notes: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Notes',
        },
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            lists: [],
            items: [],
            item: 'henrik',
            parents: [],
            account: null,
            subscriptions: {},
            subscribers: {},
        },
    },
    tribes: {
        system: {
            attributes: {
                sysnode: true,
            },
            permissions: {},
        },
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Tribes',
        },
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            lists: [],
            items: [],
            parents: [],
            account: null,
            item: 'henrik',
            subscriptions: {},
            subscribers: {},
        },
    },
    connections: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Contacts',
        },
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            lists: [],
            items: [],
            parents: [],
            account: null,
            item: 'henrik',
            subscriptions: {},
            subscribers: {},
        },
    },
    requesting: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Outgoing action requests',
        },
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            lists: [],
            items: [],
            parents: [],
            account: null,
            item: 'henrik',
            subscriptions: {},
            subscribers: {},
        },
    },
    pending: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'incoming',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Incoming action requests',
        },
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            lists: [],
            items: [],
            parents: [],
            account: null,
            item: 'henrik',
            subscriptions: {},
            subscribers: {},
        },
    },
    roles: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Roles',
        },
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            lists: [],
            items: [],
            parents: [],
            account: null,
            item: 'henrik',
            subscriptions: {},
            subscribers: {},
        },
    },
    programs: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Programs',
        },
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            lists: [],
            items: [],
            parents: [],
            account: null,
            item: 'henrik',
            subscriptions: {},
            subscribers: {},
        },
    },
    projects: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Projects',
        },
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            lists: [],
            items: [],
            parents: [],
            account: null,
            item: 'henrik',
            subscriptions: {},
            subscribers: {},
        },
    },
    tasks: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Tasks',
        },
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            lists: [],
            items: [],
            parents: [],
            account: null,
            item: 'henrik',
            subscriptions: {},
            subscribers: {},
        },
    },
    messages: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'incoming',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Direct Messages ',
        },
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            lists: [],
            items: [],
            parents: [],
            account: null,
            item: 'henrik',
            subscriptions: {},
            subscribers: {},
        },
    },
    streams: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'incoming',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Message Streams ',
        },
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            lists: [],
            items: [],
            parents: [],
            account: null,
            item: 'henrik',
            subscriptions: {},
            subscribers: {},
        },
    },
    resources: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Resources',
        },
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            lists: [],
            items: [],
            parents: [],
            account: null,
            item: 'henrik',
            subscriptions: {},
            subscribers: {},
        },
    },
    calendars: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'incoming',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Calendars',
        },
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            lists: [],
            items: [],
            parents: [],
            account: null,
            item: 'henrik',
            subscriptions: {},
            subscribers: {},
        },
    },
    accounting: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Accounting',
        },
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            lists: [],
            items: [],
            parents: [],
            account: null,
            item: 'henrik',
            subscriptions: {},
            subscribers: {},
        },
    },
    membership: {
        system: {
            attributes: {
                sysnode: true,
            },
            permissions: {},
        },
        type: {
            uid: 'incoming',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Tribalopolis Membership',
        },
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            lists: [],
            items: [],
            parents: [],
            account: null,
            item: 'henrik',
            subscriptions: {},
            subscribers: {},
        },
    },
    other: {
        system: {
            attributes: {
                sysnode: true,
            },
            permissions: {},
        },
        type: {
            uid: 'incoming',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'More...',
        },
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            lists: [],
            items: [],
            parents: [],
            account: null,
            item: 'henrik',
            subscriptions: {},
            subscribers: {},
        },
    },
    henrik: {
        system: {
            attributes: {
                sysnode: true,
            },
            permissions: {},
        },
        type: {
            uid: 'incoming',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Links Directory',
            linkedlist: false,
        },
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {
            lists: 17,
            items: 0,
        },
        references: {
            lists: [
                {
                    repo: 'lists',
                    uid: 'membership',
                },
                {
                    repo: 'lists',
                    uid: 'tribes',
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
                    uid: 'tasks',
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
                    uid: 'programs',
                },
                {
                    repo: 'lists',
                    uid: 'projects',
                },
                {
                    repo: 'lists',
                    uid: 'resources',
                },
                {
                    repo: 'lists',
                    uid: 'other',
                },
            ],
            items: [],
            item: 'henrik',
            parents: [],
            account: null,
            subscriptions: {},
            subscribers: {},
        },
    },
};
let links = {};
let items = {
    henrik: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'incoming',
            name: 'User',
            schemeuid: 'common',
        },
        identity: {
            uid: 'henrik',
            account: 'henrik',
            alias: 'henrik',
        },
        properties: {
            tag: 'Henrik',
            name: 'Henrik Bechmann',
            title: null,
            description: 'Creator of Tribalopolis',
            birthdate: '1950-08-23',
            location: 'Toronto',
            locationid: 'Toronto',
        },
        generations: {
            meta: 0,
            properties: 0,
        },
        counts: {},
        references: {
            list: { repo: 'lists', uid: 'henrik' },
            parents: [],
            account: null,
        },
    },
};
let accounts = {};
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
export { schemes, types, items, lists, links, folders, accounts }; //, subscriptions }
//# sourceMappingURL=repositories.jsx.map