// quadselector.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import { withStyles, createStyles } from '@material-ui/core/styles'

const styles = createStyles({
    root:{
        position:'absolute',
        bottom:'0',
        height:'32px',
        width:'32px',
        backgroundColor:'lightgray',
        border:'1px solid silver',
        zIndex:3,
    },
    message:{
        position:'absolute',
        top:'-30px',
        color:'white',
        border:'2px solid silver',
        borderRadius:'8px',
        backgroundColor:'gray',
        fontSize:'x-small',
        padding:'8px',
    },
    iconbutton:{
        height:'32px',
        width:'32px',
        padding:'0',
    }
})

class QuadSelector extends React.Component<any,any> {

    state = {
        selected:false,
    }

    render() {

        let {quadrantPosition, split, selectQuadrant, classes } = this.props
        let component = null

        let element:any = null

        if (split != 'none') {
            let icon = null
            switch (quadrantPosition) {
                case 'topleft':
                    icon = '/public/icons/ic_border_all_black_24px_topleft.svg'
                    break
                case 'topright':
                    icon = '/public/icons/ic_border_all_black_24px_topright.svg'
                    break
                case 'bottomleft':
                    icon = '/public/icons/ic_border_all_black_24px_bottomleft.svg'
                    break
                case 'bottomright':
                    icon = '/public/icons/ic_border_all_black_24px_bottomright.svg'
                    break
            }
            let leftside = (quadrantPosition == 'topleft' || quadrantPosition == 'bottomleft')
            component = <div
                className = {classes.root}
                style = {{
                    left:leftside?'0':'auto',
                    right:leftside?'auto':'0',
                    borderRadius:leftside?'0 8px 0 0':'8px 0 0 0',
                }}
            >
                <div 
                    className = {classes.message}
                    style = {
                        {
                            visibility:this.state.selected?'visible':'hidden',
                            left:leftside?'20px':'-60px',
                        }
                }>
                    working...
                </div>
                <IconButton 
                    className = {classes.iconbutton} 
                    onClick = {() => {
                        this.setState({
                            selected:true
                        })
                        selectQuadrant(quadrantPosition)
                        setTimeout(() => {
                            this.setState({
                                selected:false
                            })
                        },600)
                    }}
                >
                    <img src = {icon} />
                </IconButton>
            </div>
        }

        return component
    }

}

export default withStyles(styles)(QuadSelector)