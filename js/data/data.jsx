// data.tsx
let linkcategoryheap = {
    diaries: {
        sessionid: 0,
        nodesystemid: 'x',
        nodekey: 'home:henrik::henrik',
        class: 'diaries',
        name: 'Diaries',
        parent_class_index: 'notes.timelogs',
        class_schema: 'common',
        aggregates: {
            // leftcount:{
            //     amount:10,
            //     pending:3,
            //     timestamp:1,
            // },
            // rightcount:{
            //     amount:8,
            //     pending:3,
            //     timestamp:1,
            // },
            childcount: {
                amount: 3,
                timestamp: 1
            },
        },
    },
    tribes: {
        sessionid: 1,
        nodesystemid: 'x',
        nodekey: 'home:henrik::henrik',
        class: 'tribes',
        name: 'Tribes',
        parent_class_index: 'notes.timelogs',
        class_schema: 'common',
        sysnode: true,
        aggregates: {
            childcount: {
                amount: 5,
                timestamp: 1
            },
        },
    },
    connections: {
        sessionid: 2,
        nodesystemid: 'x',
        nodekey: 'home:henrik::henrik',
        class: 'connections',
        name: 'Connections',
        parent_class_index: 'notes.timelogs',
        class_schema: 'common',
        aggregates: {
            childcount: {
                amount: 23,
                timestamp: 1
            },
        },
    },
    requesting: {
        sessionid: 3,
        nodesystemid: 'x',
        nodekey: 'home:henrik::henrik',
        class: 'requesting',
        name: 'Outgoing action requests',
        parent_class_index: 'notes.timelogs',
        class_schema: 'common',
        aggregates: {
            childcount: {
                amount: 12,
                timestamp: 1
            },
        },
    },
    pending: {
        sessionid: 4,
        nodesystemid: 'x',
        nodekey: 'home:henrik::henrik',
        class: 'pending',
        name: 'Incoming action requests',
        parent_class_index: 'notes.timelogs',
        class_schema: 'common',
        aggregates: {
            childcount: {
                amount: 23,
                timestamp: 1
            },
        },
    },
    roles: {
        sessionid: 5,
        nodesystemid: 'x',
        nodekey: 'home:henrik::henrik',
        class: 'roles',
        name: 'Roles',
        parent_class_index: 'notes.timelogs',
        class_schema: 'common',
        aggregates: {
            childcount: {
                amount: 4,
                timestamp: 1
            },
        },
    },
    programs: {
        sessionid: 6,
        nodesystemid: 'x',
        nodekey: 'home:henrik::henrik',
        class: 'programs',
        name: 'Programs',
        parent_class_index: 'notes.timelogs',
        class_schema: 'common',
        aggregates: {
            childcount: {
                amount: 5,
                timestamp: 1
            },
        },
    },
    projects: {
        sessionid: 7,
        nodesystemid: 'x',
        nodekey: 'home:henrik::henrik',
        class: 'projects',
        name: 'Projects',
        parent_class_index: 'notes.timelogs',
        class_schema: 'common',
        aggregates: {
            childcount: {
                amount: 3,
                timestamp: 1
            },
        },
    },
    tasks: {
        sessionid: 8,
        nodesystemid: 'x',
        nodekey: 'home:henrik::henrik',
        class: 'tasks',
        name: 'Tasks',
        parent_class_index: 'notes.timelogs',
        class_schema: 'common',
        aggregates: {
            childcount: {
                amount: 20,
                timestamp: 1
            },
        },
    },
    messengers: {
        sessionid: 9,
        nodesystemid: 'x',
        nodekey: 'home:henrik::henrik',
        class: 'messengers',
        name: 'Messengers',
        parent_class_index: 'notes.timelogs',
        class_schema: 'common',
        aggregates: {
            childcount: {
                amount: 3,
                timestamp: 1
            },
        },
    },
    resources: {
        sessionid: 10,
        nodesystemid: 'x',
        nodekey: 'home:henrik::henrik',
        class: 'resources',
        name: 'Rsources',
        parent_class_index: 'notes.timelogs',
        class_schema: 'common',
        aggregates: {
            childcount: {
                amount: 64,
                timestamp: 1
            },
        },
    },
    calendars: {
        sessionid: 11,
        nodesystemid: 'x',
        nodekey: 'home:henrik::henrik',
        class: 'calendars',
        name: 'Calendars',
        parent_class_index: 'notes.timelogs',
        class_schema: 'common',
        aggregates: {
            childcount: {
                amount: 67,
                timestamp: 1
            },
        },
    },
    accounting: {
        sessionid: 12,
        nodesystemid: 'x',
        nodekey: 'home:henrik::henrik',
        class: 'accounting',
        name: 'Accounting',
        parent_class_index: 'notes.timelogs',
        class_schema: 'common',
        aggregates: {
            childcount: {
                amount: 6000,
                timestamp: 1
            },
        },
    },
    other: {
        sessionid: 13,
        nodesystemid: 'x',
        nodekey: 'home:henrik::henrik',
        class: 'other',
        name: 'Other',
        parent_class_index: 'notes.timelogs',
        class_schema: 'common',
        sysnode: true,
        aggregates: {
            childcount: {
                amount: 2,
                timestamp: 1
            },
        },
    },
};
let objectcategoryheap = [];
let linkheap = [];
let nodeheap = [
    {
        sessionid: 0,
        class: 'primary_owner',
        parent_class: 'person',
        class_schema: 'common',
        tribe: 'home:henrik',
        recordid: 'home:henrik::henrik',
        profile: {
            tag: 'Henrik',
            name: 'Henrik Bechmann',
            title: null,
            description: 'Creator of Tribalopolis',
            birthdate: '1950-08-23',
            location: 'Toronto',
            locationid: 'Toronto',
        },
        categories: [
            'tribes',
            'connections',
            'requesting',
            'pending',
            'diaries',
            'tasks',
            'messengers',
            'calendars',
            'accounting',
            'roles',
            'programs',
            'projects',
            'resources',
            'other',
        ],
    },
];
let datastacks = [
    [[{ sessionid: 0, config: 'base' },
        ]],
    [[{ sessionid: 0, config: 'base' },
        ]],
    [[{ sessionid: 0, config: 'base' },
        ]],
    [[{ sessionid: 0, config: 'base' },
        ]],
];
export { nodeheap, datastacks, linkcategoryheap };
//# sourceMappingURL=data.jsx.map