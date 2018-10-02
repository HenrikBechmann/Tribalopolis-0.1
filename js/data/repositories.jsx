/*
    Consider including a TOKEN (summary) with each document for lists
*/
// repositories.tsx
let folders = {
    henrikacf: {
        identity: {
            container: '',
            id: '',
            type: {
                id: '',
                handle: '',
            },
            account: '',
            handle: '',
            version: 0,
            parent: '',
        },
        properties: {},
        constraints: {},
        references: {
            list: '',
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
        constraints: {},
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
            type: {
                id: '',
                handle: '',
                account: {
                    id: '',
                    handle: '',
                },
            },
            account: '',
            handle: '',
            version: 0,
            map: {},
            parent: {
                id: '',
                handle: '',
                account: {
                    id: '',
                    handle: '',
                },
            },
        },
        constraints: {},
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
            type: {
                id: '',
                handle: '',
                account: {
                    id: '',
                    handle: '',
                },
            },
            typehandle: '',
            account: '',
            handle: '',
            version: 0,
            map: {},
            parent: {
                id: '',
                handle: '',
                account: {
                    id: '',
                    handle: '',
                },
            },
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
        constraints: {},
        references: {
            list: '',
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
            type: {
                id: 'outgoing',
                handle: '',
            },
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Diaries',
        },
        constraints: {
            links: [],
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
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
            type: {
                id: 'outgoing',
                handle: '',
            },
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Notes',
        },
        constraints: {
            links: [],
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
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
            type: {
                id: 'outgoing',
                handle: '',
            },
            typehandle: '',
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Tribes',
        },
        constraints: {
            links: [],
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
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
            type: {
                id: 'outgoing',
                handle: '',
            },
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Contacts',
        },
        constraints: {
            links: [],
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
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
            type: {
                id: '',
                handle: '',
            },
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Outgoing action requests',
        },
        constraints: {
            links: [],
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
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
            type: {
                id: '',
                handle: '',
            },
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Incoming action requests',
        },
        constraints: {
            links: [],
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
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
            type: {
                id: 'outgoing',
                handle: '',
            },
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Roles',
        },
        constraints: {
            links: [],
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
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
            type: {
                id: 'outgoing',
                handle: '',
            },
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Programs',
        },
        constraints: {
            links: [],
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
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
            type: {
                id: '',
                handle: '',
            },
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Projects',
        },
        constraints: {
            links: [],
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
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
            type: {
                id: 'outgoing',
                handle: '',
            },
            account: '',
            version: 0,
        },
        properties: {
            name: 'Tasks',
        },
        constraints: {
            links: [],
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
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
            type: {
                id: '',
                handle: '',
            },
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Direct Messages',
        },
        constraints: {
            links: [],
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
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
            type: {
                id: '',
                handle: '',
            },
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Message Streams',
        },
        constraints: {
            links: [],
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
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
            type: {
                id: 'outgoing',
                handle: '',
            },
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Resources',
        },
        constraints: {
            links: [],
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
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
            type: {
                id: 'outgoing',
                handle: '',
            },
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Calendars',
        },
        constraints: {
            links: [],
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
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
            type: {
                id: 'outgoing',
                handle: '',
            },
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Accounting',
        },
        constraints: {
            links: [],
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
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
    membership: {
        identity: {
            container: '',
            id: '',
            type: {
                id: 'outgoing',
                handle: '',
            },
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Tribalopolis Membership',
        },
        constraints: {
            links: [],
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
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
    other: {
        identity: {
            container: '',
            id: '',
            type: {
                id: '',
                handle: '',
            },
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'More...',
        },
        constraints: {
            links: [],
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
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
    henrik: {
        identity: {
            container: '',
            id: '',
            type: {
                id: '',
                handle: '',
            },
            account: '',
            handle: '',
            version: 0,
        },
        properties: {
            name: 'Links Directory',
            linkedlist: false,
        },
        constraints: {
            links: [],
        },
        references: {
            subscriptions: [],
            owner: {
                id: 'henrik',
                collection: 'items',
            },
            parentlists: [],
        },
        counts: {
            lists: 17,
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
            links: [],
        },
    },
};
let links = {
    somelink: {
        identity: {
            container: '',
            id: '',
            type: {
                id: '',
                handle: '',
            },
            account: '',
            handle: '',
            version: 0,
        },
        properties: {},
        constraints: {
            origin: [],
            target: [],
        },
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
            type: {
                id: '',
                handle: 'person',
            },
            account: 'henrik',
            handle: 'henrik',
            version: 0,
        },
        properties: {
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
        constraints: {
            chain: {
                prior: '',
                next: '',
            },
        },
        references: {
            list: 'henrik',
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
        constraints: {},
        references: {},
        counts: {},
        system: {},
        data: {},
    }
};
export { schemes, types, items, lists, links, folders, accounts };
//# sourceMappingURL=repositories.jsx.map