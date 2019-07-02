// datastacks.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import docproxy from '../utilities/docproxy'

let defaultlayer = {
        account: 'accounts/VyfFksGi0Ehv7unaMoI0',

        items:[
            new docproxy(
                {doctoken:{
                    reference: 'accounts/VyfFksGi0Ehv7unaMoI0',
                    // collection:'items',
                    // id:'henrik',
                }}),
        ],
        source: {},
        settings:{},
    }


let datastacks = [ // four quadrant stacks
    [ // each quadrant stack
        { // each quadrant stack layer
            items:[ // items in the stack layer
                new docproxy(
                    {doctoken:{
                        reference:'accounts/VyfFksGi0Ehv7unaMoI0',
                        // collection:'items',
                        // id:'henrik',
                    }}),
            ],
            source: {},
            settings:{},
            account:'accounts/VyfFksGi0Ehv7unaMoI0',
            defaultlayer,
        },
    ],
    [
        {
            items:[],
            source:{},
            settings:{},
            account:null,
            defaultlayer,
        },
    ],
    [
        {
            items:[],
            source:{},
            settings:{},
            account:null,
            defaultlayer,
        },
    ],
    [
        {
            items:[],
            source:{},
            settings:{},
            account:null,
            defaultlayer,
        },
    ]
]

export { datastacks }
