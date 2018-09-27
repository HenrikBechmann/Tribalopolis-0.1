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
        identity: {
            version: 0,
        },
        properties: {},
        counts: {},
        references: {
            type: {},
            list: '',
            parentlists: [],
            account: null,
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
                owner: 'henrikaccount',
                acf: 'henrikacf',
                acl: {}
            },
        },
        identity: {
            handle: '',
            map: {},
            version: 0,
        },
        properties: {
            static: {
                is: {},
                has: {},
            }
        },
        counts: {},
        references: {
            type: {},
            parentlists: [],
            account: null,
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
            handle: '',
            map: {},
            version: 0,
        },
        properties: {
            specifications: {},
            static: {
                is: {
                    outgoing: true,
                },
                has: {},
            },
        },
        counts: {},
        references: {
            type: {},
            list: '',
            parentlists: [],
            account: null,
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
            account: null,
            type: {
                scheme: 'common',
            },
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
            type: {
                scheme: 'common',
            },
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
        identity: {
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
            type: {
                uid: 'outgoing',
                scheme: 'common',
            },
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
        identity: {
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
            account: null,
            type: {
                uid: 'outgoing',
                scheme: 'common',
            },
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
            type: {
                uid: 'outgoing',
                scheme: 'common',
            },
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
        identity: {
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
            type: {
                uid: 'incoming',
                scheme: 'common',
            },
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
        identity: {
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
            type: {
                uid: 'outgoing',
                scheme: 'common',
            },
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
        identity: {
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
            type: {
                uid: 'outgoing',
                scheme: 'common',
            },
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
        identity: {
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
            type: {
                uid: 'outgoing',
                scheme: 'common',
            },
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
        identity: {
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
            type: {
                uid: 'outgoing',
                scheme: 'common',
            },
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
        identity: {
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
            type: {
                uid: 'incoming',
                scheme: 'common',
            },
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
        identity: {
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
            type: {
                uid: 'incoming',
                scheme: 'common',
            },
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
        identity: {
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
            type: {
                uid: 'outgoing',
                scheme: 'common',
            },
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
        identity: {
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
            type: {
                uid: 'incoming',
                scheme: 'common',
            },
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
        identity: {
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
            type: {
                uid: 'outgoing',
                scheme: 'common',
            },
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
        identity: {
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
            type: {
                uid: 'incoming',
                scheme: 'common',
            },
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
        identity: {
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
            type: {
                uid: 'incoming',
                scheme: 'common',
            },
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
        identity: {
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
            type: {
                uid: 'incoming',
                scheme: 'common',
            },
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
        identity: {
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
            type: {
                uid: 'incoming',
                name: 'User',
                scheme: 'common',
            },
            list: { repo: 'lists', uid: 'henrik' },
            parentlists: [],
            account: 'henrik',
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