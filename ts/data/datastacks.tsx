// datastacks.tsx
import {serializer} from '../core/utilities/serializer'

let datastacks = [ // four quadrant stacks
    [ // each quadrant stack
        { // each quadrant stack layer
            items:[ // items in the stack layer
                {
                    datatoken:{
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
                    datatoken:{
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
                    datatoken:{
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
                    datatoken:{
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
