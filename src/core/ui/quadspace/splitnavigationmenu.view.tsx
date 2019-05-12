// splitnavigationmenu.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import React from 'react'

import IconButton from '@material-ui/core/IconButton'

import { withStyles, createStyles } from '@material-ui/core/styles'

const styles = createStyles({
    root: {
        display:'inline-block',
        verticalAlign:'middle',
    },
    iconbutton: {
        verticalAlign:'bottom',         
    }
})

const SplitNavigationMenu = ({split,changeSplitFrom, classes}) => {
    return <div className = { classes.root }>
        <IconButton
            className = { classes.iconbutton }
            style = {{marginBottom:'5px'}/*margin???*/}
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
            className = { classes.iconbutton }
            style = {{marginBottom:'5px'}/*margin???*/}
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
            className = { classes.iconbutton }
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

export default withStyles(styles)(SplitNavigationMenu)