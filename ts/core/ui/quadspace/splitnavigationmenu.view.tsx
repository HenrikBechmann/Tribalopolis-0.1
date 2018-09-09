// splitnavigationmenu.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import IconButton from '@material-ui/core/IconButton'

const SplitNavigationMenu = ({split,changeSplitFrom}) => {
    return <div style = {{display:'inline-block',verticalAlign:'middle'}}>
        <IconButton
            style = {{verticalAlign:'bottom'}}
            onClick = {() => changeSplitFrom('horizontal')}
        >
            <img 
                src = {
                    (split == 'horizontal')?
                        '/public/icons/ic_border_all_black_24px_split_red.svg':
                        '/public/icons/ic_border_all_black_24px_split.svg'
                }
            />
        </IconButton>

        <IconButton
            style = {{verticalAlign:'bottom'}}
            onClick = {() => changeSplitFrom('vertical')}
        >
            <img 
                style = {{transform:'rotate(90deg)'}}
                src = {
                    (split == 'vertical')?
                        '/public/icons/ic_border_all_black_24px_split_red.svg':
                        '/public/icons/ic_border_all_black_24px_split.svg'
                }
            />
        </IconButton>

        <IconButton
            style = {{verticalAlign:'bottom'}}
            onClick = {() => changeSplitFrom('matrix')}
        >
            <img 
                src = {
                    (split == 'matrix')?
                        '/public/icons/ic_border_all_black_24px_split_matrix_red.svg':
                        '/public/icons/ic_border_all_black_24px_split_matrix.svg'
                }
            />
        </IconButton>
    </div>
}

export default SplitNavigationMenu