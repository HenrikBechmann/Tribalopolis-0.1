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
                        collection:'items',
                        id:'henrik',
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
                // new proxy(
                //     {token:{
                //         collection:'items',
                //         id:'henrik',
                //     }}),
            ],
            source:{
            },
            settings:{
            },
            defaultitems:[
                new proxy(
                    {token:{
                        collection:'items',
                        id:'henrik',
                    }}),
            ],
        },
    ],
    [
        {
            items:[
                // new proxy(
                //     {token:{
                //         collection:'items',
                //         id:'henrik',
                //     }}),
            ],
            source: {
            },
            settings:{

            },
            defaultitems:[
                new proxy(
                    {token:{
                        collection:'items',
                        id:'henrik',
                    }}),
            ],
        },
    ],
    [
        {
            items:[
                // new proxy(
                //     {token:{
                //         collection:'items',
                //         id:'henrik',
                //     }}),
            ],
            source: {
            },
            settings:{

            },
            defaultitems:[
                new proxy(
                    {token:{
                        collection:'items',
                        id:'henrik',
                    }}),
            ],
        },
    ]
]

export { datastacks }
