// workspacedata.tsx
let lists = {
    diaries: {
        type: {
            id: 'diaries',
            parent_index: 'notes.timelogs',
            scheme: 'common',
        },
        id: {
            sessionid: 0,
            systemid: 'x',
            systemkey: 'home:henrik::henrik',
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
        links: [],
    },
    notes: {
        type: {
            id: 'notes',
            parent_index: 'notes.timelogs',
            scheme: 'common',
        },
        id: {
            sessionid: 1,
            systemid: 'x',
            systemkey: 'home:henrik::henrik',
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
        links: [],
    },
    tribes: {
        type: {
            id: 'tribes',
            parent_index: 'notes.timelogs',
            scheme: 'common',
        },
        id: {
            sessionid: 2,
            systemid: 'x',
            systemkey: 'home:henrik::henrik',
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
        links: [],
    },
    connections: {
        type: {
            id: 'connections',
            parent_index: 'notes.timelogs',
            scheme: 'common',
        },
        id: {
            sessionid: 3,
            systemid: 'x',
            systemkey: 'home:henrik::henrik',
        },
        properties: {
            name: 'Connections',
            aggregates: {
                childcount: {
                    amount: 23,
                    timestamp: 1
                },
            },
        },
        links: [],
    },
    requesting: {
        type: {
            id: 'requesting',
            parent_index: 'notes.timelogs',
            scheme: 'common',
        },
        id: {
            sessionid: 4,
            systemid: 'x',
            systemkey: 'home:henrik::henrik',
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
        links: [],
    },
    pending: {
        type: {
            id: 'pending',
            parent_index: 'notes.timelogs',
            scheme: 'common',
        },
        id: {
            sessionid: 5,
            systemid: 'x',
            systemkey: 'home:henrik::henrik',
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
        links: [],
    },
    roles: {
        type: {
            id: 'roles',
            parent_index: 'notes.timelogs',
            scheme: 'common',
        },
        id: {
            sessionid: 6,
            systemid: 'x',
            systemkey: 'home:henrik::henrik',
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
        links: [],
    },
    programs: {
        type: {
            id: 'programs',
            parent_index: 'notes.timelogs',
            scheme: 'common',
        },
        id: {
            sessionid: 7,
            systemid: 'x',
            systemkey: 'home:henrik::henrik',
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
        links: [],
    },
    projects: {
        type: {
            id: 'projects',
            parent_index: 'notes.timelogs',
            scheme: 'common',
        },
        id: {
            sessionid: 8,
            systemid: 'x',
            systemkey: 'home:henrik::henrik',
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
        links: [],
    },
    tasks: {
        type: {
            id: 'tasks',
            parent_index: 'notes.timelogs',
            scheme: 'common',
        },
        id: {
            sessionid: 9,
            systemid: 'x',
            systemkey: 'home:henrik::henrik',
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
        links: [],
    },
    messages: {
        type: {
            id: 'messengers',
            parent_index: 'notes.timelogs',
            scheme: 'common',
        },
        id: {
            sessionid: 10,
            systemid: 'x',
            systemkey: 'home:henrik::henrik',
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
        links: [],
    },
    streams: {
        type: {
            type: 'messengers',
            parent_type_index: 'notes.timelogs',
            type_scheme: 'common',
        },
        id: {
            sessionid: 11,
            systemid: 'x',
            systemkey: 'home:henrik::henrik',
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
        links: [],
    },
    resources: {
        type: {
            id: 'resources',
            parent_index: 'notes.timelogs',
            scheme: 'common',
        },
        id: {
            sessionid: 12,
            systemid: 'x',
            systemkey: 'home:henrik::henrik',
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
        links: [],
    },
    calendars: {
        type: {
            type: 'calendars',
            parent_type_index: 'notes.timelogs',
            type_scheme: 'common',
        },
        id: {
            sessionid: 12,
            systemid: 'x',
            systemkey: 'home:henrik::henrik',
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
        links: [],
    },
    accounting: {
        type: {
            id: 'accounting',
            parent__index: 'notes.timelogs',
            scheme: 'common',
        },
        id: {
            sessionid: 13,
            systemid: 'x',
            systemkey: 'home:henrik::henrik',
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
        links: [],
    },
    membership: {
        type: {
            id: 'other',
            parent_index: 'notes.timelogs',
            scheme: 'common',
        },
        id: {
            sessionid: 14,
            systemid: 'x',
            systemkey: 'home:henrik::henrik',
        },
        properties: {
            name: 'Membership',
            sysnode: true,
            aggregates: {
                childcount: {
                    amount: 2,
                    timestamp: 1
                },
            },
        },
        links: [],
    },
    other: {
        type: {
            id: 'other',
            parent_index: 'notes.timelogs',
            scheme: 'common',
        },
        id: {
            sessionid: 15,
            systemid: 'x',
            systemkey: 'home:henrik::henrik',
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
        links: [],
    },
};
let links = {};
let nodes = {
    henrik: {
        type: {
            id: 'member',
            name: 'member',
            scheme: 'common',
        },
        id: {
            sessionid: 0,
            id: 'henrik',
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
        links: [
            {
                repo: 'lists',
                id: 'membership',
            },
            {
                repo: 'lists',
                id: 'tribes',
            },
            {
                repo: 'lists',
                id: 'connections',
            },
            {
                repo: 'lists',
                id: 'requesting',
            },
            {
                repo: 'lists',
                id: 'pending',
            },
            {
                repo: 'lists',
                id: 'diaries',
            },
            {
                repo: 'lists',
                id: 'notes',
            },
            {
                repo: 'lists',
                id: 'tasks',
            },
            {
                repo: 'lists',
                id: 'messages',
            },
            {
                repo: 'lists',
                id: 'streams',
            },
            {
                repo: 'lists',
                id: 'calendars',
            },
            {
                repo: 'lists',
                id: 'accounting',
            },
            {
                repo: 'lists',
                id: 'roles',
            },
            {
                repo: 'lists',
                id: 'programs',
            },
            {
                repo: 'lists',
                id: 'projects',
            },
            {
                repo: 'lists',
                id: 'resources',
            },
            {
                repo: 'lists',
                id: 'other',
            },
        ],
    },
};
let schemes = {
    common: {},
};
let stacks = [
    [
        {
            ref: { repo: 'nodes', id: 'henrik' },
            config: 'base',
        },
    ],
    [
        {
            ref: { repo: 'nodes', id: 'henrik' },
            config: 'base',
        },
    ],
    [
        {
            ref: { repo: 'nodes', id: 'henrik' },
            config: 'base',
        },
    ],
    [
        {
            ref: { repo: 'nodes', id: 'henrik' },
            config: 'base',
        },
    ],
];
export { lists, links, nodes, schemes, stacks };
//# sourceMappingURL=repositories.jsx.map