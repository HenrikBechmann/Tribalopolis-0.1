// quadnavigationmenu.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import { withStyles, createStyles } from '@material-ui/core/styles'

const styles = createStyles({
    root:{
        display:'inline-block',
        verticalAlign:'middle',
    },
    iconbutton: {
        verticalAlign:'bottom',
    }
})

const QuadNavigationMenu = ({ currentQuadPosition, split, selectQuad, classes }) => {
    return <div className = {classes.root}>
        <IconButton
            className = {classes.iconbutton}
            onClick = {() => {
                selectQuad('topleft')
            }}
        >
            <img 
                style = {
                    {
                        backgroundColor:(
                            currentQuadPosition == 'topleft')?'red':
                            ((split == 'vertical' && currentQuadPosition == 'bottomleft') ||
                            (split == 'horizontal' && currentQuadPosition == 'topright') ||
                            (split == 'matrix')
                        )?'orange':'transparent'
                    }
                }
                src = {
                    (split == 'none' || split == 'matrix')?'/public/icons/ic_border_all_black_24px_topleft.svg':
                    (split == 'vertical')?'/public/icons/ic_border_all_black_24px_topleft_leftsplit.svg':
                    '/public/icons/ic_border_all_black_24px_topleft_topsplit.svg'
                }
            />
        </IconButton>

        <IconButton
            className = {classes.iconbutton}
            onClick = {() => {
                selectQuad('topright')
            }}
        >
            <img 
                style = {
                    {
                        backgroundColor:(
                            currentQuadPosition == 'topright')?'red':
                            ((split == 'vertical' && currentQuadPosition == 'bottomright') ||
                            (split == 'horizontal' && currentQuadPosition == 'topleft') ||
                            (split == 'matrix')
                        )?'orange':'transparent'
                    }
                }
                src = {
                    (split == 'none' || split == 'matrix')?'/public/icons/ic_border_all_black_24px_topright.svg':
                    (split == 'vertical')?'/public/icons/ic_border_all_black_24px_topright_rightsplit.svg':
                    '/public/icons/ic_border_all_black_24px_topright_topsplit.svg'
                }
                />
        </IconButton>

        <IconButton
            className = {classes.iconbutton}
            onClick = {() => {
                selectQuad('bottomleft')
            }}
        >
            <img 
                style = {
                    {
                        backgroundColor:(
                            currentQuadPosition == 'bottomleft')?'red': 
                            ((split == 'vertical' && currentQuadPosition == 'topleft') ||
                            (split == 'horizontal' && currentQuadPosition == 'bottomright') ||
                            (split == 'matrix')
                        )?'orange':'transparent'
                    }
                }
                src = {
                    (split == 'none' || split == 'matrix')?'/public/icons/ic_border_all_black_24px_bottomleft.svg':
                    (split == 'vertical')?'/public/icons/ic_border_all_black_24px_bottomleft_leftsplit.svg':
                    '/public/icons/ic_border_all_black_24px_bottomleft_bottomsplit.svg'
                }
            />
        </IconButton>

        <IconButton
            className = {classes.iconbutton}
            onClick = {() => {
                selectQuad('bottomright')
            }}
        >
            <img 
                style = {
                    {
                        backgroundColor:(
                            currentQuadPosition == 'bottomright')?'red':
                            ((split == 'vertical' && currentQuadPosition == 'topright') ||
                            (split == 'horizontal' && currentQuadPosition == 'bottomleft') ||
                            (split == 'matrix')
                        )?'orange':'transparent'
                    }
                }
                src = {
                    (split == 'none' || split == 'matrix')?'/public/icons/ic_border_all_black_24px_bottomright.svg':
                    (split == 'vertical')?'/public/icons/ic_border_all_black_24px_bottomright_rightsplit.svg':
                    '/public/icons/ic_border_all_black_24px_bottomright_bottomsplit.svg'
                }
            />
        </IconButton>

    </div>
}

export default withStyles(styles)(QuadNavigationMenu)
