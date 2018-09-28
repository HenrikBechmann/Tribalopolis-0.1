/*
    Consider including a TOKEN (summary) with each document for lists
*/
// repositories.tsx
let folders = {
    henrikacf: {
        identity: {
            container: '',
            id: '',
            type: '',
            account: '',
            handle: '',
            version: 0,
        },
        properties: {},
        references: {
            list: '',
            parentlists: [],
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
        references: {},
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
            type: '',
            account: '',
            handle: '',
            version: 0,
            map: {},
            parent: '',
        },
        properties: {
            interface: {},
            defaults: {},
            display: {},
            static: {
                is: {},
                has: {},
            }
        },
        references: {
            parentlists: [],
            list: '',
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
            type: '',
            account: '',
            handle: '',
            version: 0,
            map: {},
            parent: '',
        },
        properties: {
            interface: {},
            defaults: {},
            display: {},
            static: {
                is: {
                    outgoing: true,
                },
                has: {},
            },
        },
        references: {
            list: '',
            parentlists: [],
        },
        counts: {},
        system: {
            attributes: {},
            permissions: {},
        },
        data: {},
    },
};
let lists = {
    diaries: {
        identity: {
            container: '',
            id: '',
            type: '',
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Diaries',
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
        },
        counts: {
            lists: 0,
            items: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            items: [],
        },
    },
    notes: {
        identity: {
            container: '',
            id: '',
            type: '',
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Notes',
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
        },
        counts: {
            lists: 0,
            items: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            items: [],
        },
    },
    tribes: {
        identity: {
            container: '',
            id: '',
            type: '',
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Tribes',
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
        },
        counts: {
            lists: 0,
            items: 0,
        },
        system: {
            attributes: {
                sysnode: true,
            },
            permissions: {},
        },
        data: {
            lists: [],
            items: [],
        },
    },
    connections: {
        identity: {
            container: '',
            id: '',
            type: '',
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Contacts',
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            items: [],
        },
        counts: {
            lists: 0,
            items: 0,
        },
    },
    requesting: {
        identity: {
            container: '',
            id: '',
            type: '',
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Outgoing action requests',
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
        },
        counts: {
            lists: 0,
            items: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            items: [],
        },
    },
    pending: {
        identity: {
            container: '',
            id: '',
            type: '',
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Incoming action requests',
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
        },
        counts: {
            lists: 0,
            items: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            items: [],
        },
    },
    roles: {
        identity: {
            container: '',
            id: '',
            type: '',
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Roles',
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
        },
        counts: {
            lists: 0,
            items: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            items: [],
        },
    },
    programs: {
        identity: {
            container: '',
            id: '',
            type: '',
            account: '',
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
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
        },
        counts: {
            lists: 0,
            items: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            items: [],
        },
    },
    projects: {
        identity: {
            container: '',
            id: '',
            type: '',
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Projects',
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
        },
        counts: {
            lists: 0,
            items: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            items: [],
        },
    },
    tasks: {
        identity: {
            container: '',
            id: '',
            type: '',
            account: '',
            version: 0,
        },
        properties: {
            name: 'Tasks',
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
        },
        counts: {
            lists: 0,
            items: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            items: [],
        },
    },
    messages: {
        identity: {
            container: '',
            id: '',
            type: '',
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Direct Messages ',
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
        },
        counts: {
            lists: 0,
            items: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            items: [],
        },
    },
    streams: {
        identity: {
            container: '',
            id: '',
            type: '',
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Message Streams ',
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
        },
        counts: {
            lists: 0,
            items: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            items: [],
        },
    },
    resources: {
        identity: {
            container: '',
            id: '',
            type: '',
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Resources',
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
        },
        counts: {
            lists: 0,
            items: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            items: [],
        },
    },
    calendars: {
        identity: {
            container: '',
            id: '',
            type: '',
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Calendars',
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
        },
        counts: {
            lists: 0,
            items: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            items: [],
        },
    },
    accounting: {
        identity: {
            container: '',
            id: '',
            type: '',
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Accounting',
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
        },
        counts: {
            lists: 0,
            items: 0,
        },
        system: {
            attributes: {},
            permissions: {},
        },
        data: {
            lists: [],
            items: [],
        },
    },
    membership: {
        identity: {
            container: '',
            id: '',
            type: '',
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Tribalopolis Membership',
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
        },
        counts: {
            lists: 0,
            items: 0,
        },
        system: {
            attributes: {
                sysnode: true,
            },
            permissions: {},
        },
        data: {
            lists: [],
            items: [],
        },
    },
    other: {
        identity: {
            container: '',
            id: '',
            type: '',
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'More...',
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
        },
        counts: {
            lists: 0,
            items: 0,
        },
        system: {
            attributes: {
                sysnode: true,
            },
            permissions: {},
        },
        data: {
            lists: [],
            items: [],
        },
    },
    henrik: {
        identity: {
            container: '',
            id: '',
            type: '',
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Links Directory',
            linkedlist: false,
        },
        references: {
            subscriptions: [],
            owneritem: 'henrik',
            parentlists: [],
        },
        counts: {
            lists: 17,
            items: 0,
        },
        system: {
            attributes: {
                sysnode: true,
            },
            permissions: {},
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
let links = {
    somelink: {
        identity: {},
        properties: {},
        references: {},
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
        references: {
            list: { repo: 'lists', uid: 'henrik' },
            parentlists: [],
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
export { schemes, types, items, lists, links, folders, accounts }; //, subscriptions }
//# sourceMappingURL=repositories.jsx.map