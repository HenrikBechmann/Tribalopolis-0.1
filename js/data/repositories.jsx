/*
    Consider including a TOKEN (summary) with each document for lists
*/
// repositories.tsx
let folders = {
    henrikacf: {
        system: {
            attributes: {},
            permissions: {
                acl: {},
                folder: '',
            },
        },
        identity: {
            container: '',
            id: '',
            type: '',
            account: null,
            handle: '',
            version: 0,
        },
        properties: {},
        counts: {},
        references: {
            list: '',
            parentlists: [],
        },
        data: {},
    }
};
let schemes = {
    system: {},
    identity: {},
    properties: {},
    counts: {},
    references: {},
    data: {},
};
let types = {
    incoming: {
        system: {
            attributes: {},
            permissions: {
                folder: '',
                acl: {},
            },
        },
        identity: {
            container: '',
            id: '',
            type: '',
            account: null,
            handle: '',
            version: 0,
            map: {},
        },
        properties: {
            interface: {},
            defaults: {},
            static: {
                is: {},
                has: {},
            }
        },
        counts: {},
        references: {
            parentlists: [],
            list: {},
        },
        data: {},
    },
    outgoing: {
        system: {
            attributes: {},
            permissions: {},
        },
        identity: {
            container: '',
            id: '',
            type: '',
            account: null,
            handle: '',
            version: 0,
            map: {},
        },
        properties: {
            interface: {},
            defaults: {},
            static: {
                is: {
                    outgoing: true,
                },
                has: {},
            },
        },
        counts: {},
        references: {
            list: '',
            parentlists: [],
        },
        data: {},
    },
};
let lists = {
    diaries: {
        system: {
            attributes: {},
            permissions: {},
        },
        identity: {
            container: '',
            id: '',
            type: '',
            account: null,
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Diaries',
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
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
        identity: {
            container: '',
            id: '',
            type: '',
            account: null,
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Notes',
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
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
        identity: {
            container: '',
            id: '',
            type: '',
            account: null,
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Tribes',
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
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
        identity: {
            container: '',
            id: '',
            type: '',
            account: null,
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Contacts',
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
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
        identity: {
            container: '',
            id: '',
            type: '',
            account: null,
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Outgoing action requests',
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
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
        identity: {
            container: '',
            id: '',
            type: '',
            account: null,
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Incoming action requests',
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
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
        identity: {
            container: '',
            id: '',
            type: '',
            account: null,
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Roles',
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
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
        identity: {
            container: '',
            id: '',
            type: '',
            account: null,
            handle: '',
            version: 0,
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
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
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
        identity: {
            container: '',
            id: '',
            type: '',
            account: null,
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Projects',
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
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
        identity: {
            container: '',
            id: '',
            type: '',
            account: null,
            version: 0,
        },
        properties: {
            name: 'Tasks',
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
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
        identity: {
            container: '',
            id: '',
            type: '',
            account: null,
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Direct Messages ',
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
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
        identity: {
            container: '',
            id: '',
            type: '',
            account: null,
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Message Streams ',
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
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
        identity: {
            container: '',
            id: '',
            type: '',
            account: null,
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Resources',
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
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
        identity: {
            container: '',
            id: '',
            type: '',
            account: null,
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Calendars',
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
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
        identity: {
            container: '',
            id: '',
            type: '',
            account: null,
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Accounting',
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
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
        identity: {
            container: '',
            id: '',
            type: '',
            account: null,
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Tribalopolis Membership',
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
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
        identity: {
            container: '',
            id: '',
            type: '',
            account: null,
            handle: '',
            version: 0,
        },
        properties: {
            name: 'More...',
        },
        counts: {
            lists: 0,
            items: 0,
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
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
        identity: {
            container: '',
            id: '',
            type: '',
            account: null,
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Links Directory',
            linkedlist: false,
        },
        counts: {
            lists: 17,
            items: 0,
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
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
        identity: {
            container: '',
            id: '',
            type: '',
            account: 'henrik',
            handle: 'henrik',
            version: 0,
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
        counts: {},
        references: {
            list: { repo: 'lists', uid: 'henrik' },
            parentlists: [],
        },
        data: {},
    },
};
let accounts = {
    system: {},
    identity: {},
    properties: {},
    counts: {},
    references: {},
    data: {},
};
export { schemes, types, items, lists, links, folders, accounts }; //, subscriptions }
//# sourceMappingURL=repositories.jsx.map