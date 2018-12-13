// datastacks.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import docproxy from '../core/utilities/docproxy'

let datastacks = [ // four quadrant stacks
    [ // each quadrant stack
        { // each quadrant stack layer
            items:[ // items in the stack layer
                new docproxy(
                    {doctoken:{
                        reference:'/items/henrik',
                        // collection:'items',
                        // id:'henrik',
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
                // new docproxy(
                //     {doctoken:{
                //         collection:'items',
                //         id:'henrik',
                //     }}),
            ],
            source:{
            },
            settings:{
            },
            defaultitems:[
                new docproxy(
                    {doctoken:{
                        reference: '/items/henrik',
                        // collection:'items',
                        // id:'henrik',
                    }}),
            ],
        },
    ],
    [
        {
            items:[
                // new docproxy(
                //     {doctoken:{
                //         collection:'items',
                //         id:'henrik',
                //     }}),
            ],
            source: {
            },
            settings:{

            },
            defaultitems:[
                new docproxy(
                    {doctoken:{
                        reference:'/items/henrik',
                        // collection:'items',
                        // id:'henrik',
                    }}),
            ],
        },
    ],
    [
        {
            items:[
                // new docproxy(
                //     {doctoken:{
                //         collection:'items',
                //         id:'henrik',
                //     }}),
            ],
            source: {
            },
            settings:{

            },
            defaultitems:[
                new docproxy(
                    {doctoken:{
                        reference:'/items/henrik',
                        // collection:'items',
                        // id:'henrik',
                    }}),
            ],
        },
    ]
]

export { datastacks }
