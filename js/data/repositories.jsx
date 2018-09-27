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
            parentlists: [],
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
        type: {
            linktypes: [],
        },
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
            parentlists: [],
            account: null,
        },
    },
    outgoing: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            linktypes: [],
        },
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
            parentlists: [],
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
            scheme: 'common',
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
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
            account: null,
        },
        data: {
            lists: [],
            items: [],
        },
    },
    notes: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'outgoing',
            scheme: 'common',
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
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
            account: null,
        },
        data: {
            lists: [],
            items: [],
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
            scheme: 'common',
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
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
            account: null,
        },
        data: {
            lists: [],
            items: [],
        },
    },
    connections: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'outgoing',
            scheme: 'common',
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
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
            account: null,
        },
        data: {
            lists: [],
            items: [],
        },
    },
    requesting: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'outgoing',
            scheme: 'common',
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
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
            account: null,
        },
        data: {
            lists: [],
            items: [],
        },
    },
    pending: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'incoming',
            scheme: 'common',
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
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
            account: null,
        },
        data: {
            lists: [],
            items: [],
        },
    },
    roles: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'outgoing',
            scheme: 'common',
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
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
            account: null,
        },
        data: {
            lists: [],
            items: [],
        },
    },
    programs: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'outgoing',
            scheme: 'common',
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
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
            account: null,
        },
        data: {
            lists: [],
            items: [],
        },
    },
    projects: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'outgoing',
            scheme: 'common',
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
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
            account: null,
        },
        data: {
            lists: [],
            items: [],
        },
    },
    tasks: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'outgoing',
            scheme: 'common',
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
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
            account: null,
        },
        data: {
            lists: [],
            items: [],
        },
    },
    messages: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'incoming',
            scheme: 'common',
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
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
            account: null,
        },
        data: {
            lists: [],
            items: [],
        },
    },
    streams: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'incoming',
            scheme: 'common',
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
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
            account: null,
        },
        data: {
            lists: [],
            items: [],
        },
    },
    resources: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'outgoing',
            scheme: 'common',
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
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
            account: null,
        },
        data: {
            lists: [],
            items: [],
        },
    },
    calendars: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'incoming',
            scheme: 'common',
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
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
            account: null,
        },
        data: {
            lists: [],
            items: [],
        },
    },
    accounting: {
        system: {
            attributes: {},
            permissions: {},
        },
        type: {
            uid: 'outgoing',
            scheme: 'common',
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
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
            account: null,
        },
        data: {
            lists: [],
            items: [],
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
            scheme: 'common',
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
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
            account: null,
        },
        data: {
            lists: [],
            items: [],
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
            scheme: 'common',
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
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
            account: null,
        },
        data: {
            lists: [],
            items: [],
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
            scheme: 'common',
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
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
            account: null,
        },
        data: {
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
            scheme: 'common',
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
            parentlists: [],
            account: null,
        },
    },
};
let accounts = {};
export { schemes, types, items, lists, links, folders, accounts }; //, subscriptions }
//# sourceMappingURL=repositories.jsx.map