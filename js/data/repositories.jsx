// workspacedata.tsx
import { serializer } from '../core/utilities/serializer';
let schemes = {
    type: {},
    list: {},
    item: {},
    link: {},
};
let types = {
    list: {
        common: {
            __default__: {
                type: {},
                identity: {},
                properties: {
                    is: {},
                    has: {},
                },
            },
            outgoing: {
                type: {},
                identity: {},
                properties: {
                    is: {
                        outgoing: true,
                    },
                    has: {},
                },
            },
        },
    },
    item: {},
    link: {},
};
let lists = {
    diaries: {
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Diaries',
            aggregates: {
                childcount: {
                    amount: 3,
                    timestamp: 1
                },
            },
        },
        list: [],
    },
    notes: {
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Notes',
            aggregates: {
                childcount: {
                    amount: 310,
                    timestamp: 1
                },
            },
        },
        list: [],
    },
    tribes: {
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Tribes',
            sysnode: true,
            aggregates: {
                childcount: {
                    amount: 5,
                    timestamp: 1
                },
            },
        },
        list: [],
    },
    connections: {
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Contacts',
            aggregates: {
                childcount: {
                    amount: 23,
                    timestamp: 1
                },
            },
        },
        list: [],
    },
    requesting: {
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Outgoing action requests',
            aggregates: {
                childcount: {
                    amount: 12,
                    timestamp: 1
                },
            },
        },
        list: [],
    },
    pending: {
        type: {
            uid: 'pending',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Incoming action requests',
            aggregates: {
                childcount: {
                    amount: 23,
                    timestamp: 1
                },
            },
        },
        list: [],
    },
    roles: {
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Roles',
            aggregates: {
                childcount: {
                    amount: 4,
                    timestamp: 1
                },
            },
        },
        list: [],
    },
    programs: {
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Programs',
            aggregates: {
                childcount: {
                    amount: 5,
                    timestamp: 1
                },
            },
        },
        list: [],
    },
    projects: {
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Projects',
            aggregates: {
                childcount: {
                    amount: 3,
                    timestamp: 1
                },
            },
        },
        list: [],
    },
    tasks: {
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Tasks',
            aggregates: {
                childcount: {
                    amount: 20,
                    timestamp: 1
                },
            },
        },
        list: [],
    },
    messages: {
        type: {
            uid: 'messengers',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Direct Messages ',
            aggregates: {
                childcount: {
                    amount: 3,
                    timestamp: 1
                },
            },
        },
        list: [],
    },
    streams: {
        type: {
            type: 'messengers',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Message Streams ',
            aggregates: {
                childcount: {
                    amount: 100,
                    timestamp: 1
                },
            },
        },
        list: [],
    },
    resources: {
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Resources',
            aggregates: {
                childcount: {
                    amount: 64,
                    timestamp: 1
                },
            },
        },
        list: [],
    },
    calendars: {
        type: {
            uid: 'calendars',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Calendars',
            aggregates: {
                childcount: {
                    amount: 67,
                    timestamp: 1
                },
            },
        },
        list: [],
    },
    accounting: {
        type: {
            uid: 'outgoing',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Accounting',
            aggregates: {
                childcount: {
                    amount: 6000,
                    timestamp: 1
                },
            },
        },
        list: [],
    },
    membership: {
        type: {
            uid: 'other',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Tribalopolis Membership',
            sysnode: true,
            aggregates: {
                childcount: {
                    amount: 2,
                    timestamp: 1
                },
            },
        },
        list: [],
    },
    other: {
        type: {
            uid: 'other',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'More...',
            sysnode: true,
            aggregates: {
                childcount: {
                    amount: 2,
                    timestamp: 1
                },
            },
        },
        list: [],
    },
    henrik: {
        type: {
            uid: 'member',
            schemeuid: 'common',
        },
        identity: {
            uid: 'x',
        },
        properties: {
            name: 'Links Directory',
            sysnode: true,
            aggregates: {
                childcount: {
                    amount: 6558,
                    timestamp: 1
                },
            },
        },
        list: [
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
    },
};
let links = {};
let items = {
    henrik: {
        type: {
            uid: 'member',
            name: 'member',
            schemeuid: 'common',
        },
        identity: {
            uid: 'henrik',
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
        list: { repo: 'lists', uid: 'henrik' },
    },
};
let datastacks = [
    [
        {
            items: [
                {
                    dataref: {
                        repo: 'items',
                        uid: 'henrik',
                    },
                    instanceid: serializer.getid(),
                    liststack: [],
                    settings: {},
                },
            ],
            source: {},
            settings: {},
        },
    ],
    [
        {
            items: [
                {
                    dataref: {
                        repo: 'items',
                        uid: 'henrik',
                    },
                    instanceid: serializer.getid(),
                    liststack: [],
                    settings: {},
                },
            ],
            source: {},
            settings: {},
        },
    ],
    [
        {
            items: [
                {
                    dataref: {
                        repo: 'items',
                        uid: 'henrik',
                    },
                    instanceid: serializer.getid(),
                    liststack: [],
                    settings: {},
                },
            ],
            source: {},
            settings: {},
        },
    ],
    [
        {
            items: [
                {
                    dataref: {
                        repo: 'items',
                        uid: 'henrik',
                    },
                    instanceid: serializer.getid(),
                    liststack: [],
                    settings: {},
                },
            ],
            source: {},
            settings: {},
        },
    ]
];
export { schemes, types, items, lists, links, datastacks };
//# sourceMappingURL=repositories.jsx.map