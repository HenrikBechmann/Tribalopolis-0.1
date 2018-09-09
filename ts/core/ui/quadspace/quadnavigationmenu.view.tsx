// quadnavigationmenu.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import IconButton from '@material-ui/core/IconButton'

const QuadNavigationMenu = ({ currentQuadPosition, split, selectQuad }) => {
    return <div style = {{display:'inline-block',verticalAlign:'middle'}}>
        <IconButton
            style = {{verticalAlign:'bottom',}}
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
            style = {{verticalAlign:'bottom'}}
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
            style = {{verticalAlign:'bottom'}}
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
            style = {{verticalAlign:'bottom'}}
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

export default QuadNavigationMenu
