// datastacks.tsx
import {serializer} from '../core/utilities/serializer'

let datastacks = [ // four quadrant stacks
    [ // each quadrant stack
        { // each quadrant stack layer
            items:[ // items in the stack layer
                {
                    doctoken:{
                        repo:'items',
                        uid:'henrik',
                    },
                    instanceid:serializer.getid(),
                    liststack:[],
                    settings:{
                    },
                },
            ],
            source: {},
            settings:{
            },
        },
    ],
    [
        {
            items:[
                {
                    doctoken:{
                        repo:'items',
                        uid:'henrik',
                    },
                    instanceid:serializer.getid(),
                    liststack:[],
                    settings:{},
                },
            ],
            source:{
            },
            settings:{
            },
        },
    ],
    [
        {
            items:[
                {
                    doctoken:{
                        repo:'items',
                        uid:'henrik',
                    },
                    instanceid:serializer.getid(),
                    liststack:[],
                    settings:{

                    },
                },
            ],
            source: {
            },
            settings:{

            },
        },
    ],
    [
        {
            items:[
                {
                    doctoken:{
                        repo:'items',
                        uid:'henrik',
                    },
                    instanceid:serializer.getid(),
                    liststack:[],
                    settings:{},
                },
            ],
            source: {
            },
            settings:{

            },
        },
    ]
]

export { datastacks }
