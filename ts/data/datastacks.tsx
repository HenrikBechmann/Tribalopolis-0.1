// datastacks.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import proxy from '../core/utilities/proxy'

let datastacks = [ // four quadrant stacks
    [ // each quadrant stack
        { // each quadrant stack layer
            items:[ // items in the stack layer
                new proxy(
                    {token:{
                        repo:'items',
                        uid:'henrik',
                    }}),
            ],
            source: {},
            settings:{
            },
        },
    ],
    [
        {
            items:[
                new proxy(
                    {token:{
                        repo:'items',
                        uid:'henrik',
                    }}),
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
                new proxy(
                    {token:{
                        repo:'items',
                        uid:'henrik',
                    }}),
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
                new proxy(
                    {token:{
                        repo:'items',
                        uid:'henrik',
                    }}),
            ],
            source: {
            },
            settings:{

            },
        },
    ]
]

export { datastacks }
