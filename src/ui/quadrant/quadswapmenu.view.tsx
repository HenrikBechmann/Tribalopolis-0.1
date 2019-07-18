// swapmenu.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles, createStyles } from '@material-ui/core/styles'
import ActionButton from '../common/actionbutton.view'
import PopupMenu from '../common/popupmenu.view'
import Divider from '@material-ui/core/Divider'

const styles = createStyles({
    root:{
        position:'absolute',
        right:'6px',
        top:'6px',
        border:'1px solid silver',
        borderRadius:'0 0 0 8px',
        backgroundColor:'lightgray',
        zIndex:1,
        padding:'3px',
    },
    menustyle:{
        padding:'6px',
        fontSize:'.86rem',
    }
})

class SwapMenu extends React.Component<any, any> {

    constructor(props) {
        super(props)
        this.menuAnchor = React.createRef()
    }

    state = {
        menuopen:false,
    }

    menuAnchor

    toggleMenu = () => {
        this.setState(state => ({ menuopen: !state.menuopen }));
    }

    menuClose = event => {
        if (this.menuAnchor.current.contains(event.target)) {
          return;
        }

        this.setState({ menuopen: false });
    }

    selectQuadrantFrom = (direction) => {
        let currentPosition = this.props.quadrantPosition
        let target
        switch (currentPosition) {
            case 'topleft': {
                switch (direction) {
                    case 'horizontal':{
                        target = 'topright'
                        break
                    }
                    case 'tilted': {
                        target = 'bottomright'
                        break
                    }
                    case 'vertical': {
                        target = 'bottomleft'
                        break
                    }
                }
                break
            }
            case 'topright': {
                switch (direction) {
                    case 'horizontal': {
                        target = 'topleft'
                        break
                    }
                    case 'tilted': {
                        target = 'bottomleft'
                        break
                    }
                    case 'vertical': {
                        target = 'bottomright'
                        break
                    }
                }
                break
            }
            case 'bottomleft': {
                switch (direction) {
                    case 'horizontal': {
                        target = 'bottomright'
                        break
                    }
                    case 'tilted': {
                        target = 'topright'
                        break
                    }
                    case 'vertical': {
                        target = 'topleft'
                        break
                    }
                }
                break
            }
            case 'bottomright': {
                switch (direction) {
                    case 'horizontal': {
                        target = 'bottomleft'
                        break
                    }
                    case 'tilted': {
                        target = 'topleft'
                        break
                    }
                    case 'vertical': {
                        target = 'topright'
                        break
                    }
                }
                break
            }
        }
        this.props.selectQuadrant(target)
    }

    render() {
        let { quadrantPosition, handleSwap, selectQuadrant, classes } = this.props

        let tilt = null
        let gotilta = null
        let gotiltb = null
        let gotiltc = null
        if (quadrantPosition == 'topleft' || quadrantPosition == 'bottomright') {
            tilt = '-45deg'
            if (quadrantPosition == 'topleft') {
                gotilta = '0deg'
                gotiltb = '45deg'
                gotiltc = '90deg'
            } else { // bottom right
                gotilta = '180deg'
                gotiltb = '225deg'
                gotiltc = '-90deg'
            }
        } else {
            tilt = '45deg'
            if (quadrantPosition == 'bottomleft') {
                gotilta = '0deg'
                gotiltb = '-45deg'
                gotiltc = '-90deg'
            } else { // top right
                gotilta = '180deg'
                gotiltb = '-225deg'
                gotiltc = '90deg'
            }
        }

        return <div 
            className = {classes.root} 
        >
            <div 
                ref = {this.menuAnchor}
            >
                <ActionButton 
                    buttonStyle = {
                        {
                            float:'none',
                            width:'24px',
                            height:'24px',
                        }
                    } 
                    icon = 'menu' 
                    action = {this.toggleMenu}
                />
            </div>

            <PopupMenu
                menuopen = {this.state.menuopen}
                menuAnchor = {this.menuAnchor}
                menuClose = {this.menuClose}
                anchorOrigin = {
                    {
                        vertical:'bottom',
                        horizontal:'left',
                    }
                }
            >
                <MenuItem className = {classes.menustyle}
                    onClick={this.menuClose}>

                <div 
                    style = {
                        {
                            display:'inline-block',
                            marginRight:'6px',
                        }
                    }
                >
                    Go to
                </div>

                <ActionButton 
                    iconStyle = {{color:'green',transform:`rotate(${gotilta})`}}
                    icon = 'arrow_right_alt'
                    action = {() => {
                        this.selectQuadrantFrom('horizontal')
                    }} />
                <ActionButton 
                    iconStyle = {{color:'green',transform:`rotate(${gotiltc})`}}
                    icon = 'arrow_right_alt'
                    action = {() => {
                        this.selectQuadrantFrom('vertical')
                    }} />
                <ActionButton 
                    iconStyle = {{color:'green',transform:`rotate(${gotiltb})`}}
                    icon = 'arrow_right_alt'
                    action = {() => {
                        this.selectQuadrantFrom('tilted')
                    }} />
                </MenuItem>
                <Divider />
                <MenuItem className = {classes.menustyle}
                    onClick={this.menuClose}>

                <div 
                    style = {
                        {
                            display:'inline-block',
                            marginRight:'6px',
                        }
                    }
                >
                    Swap
                </div>

                <ActionButton 
                    iconStyle = {{color:'green'}}
                    icon = 'swap_horiz'
                    action = {() => {
                        handleSwap(quadrantPosition,'horizontal')
                    }} />
                <ActionButton 
                    iconStyle = {{color:'green'}}
                    icon = 'swap_vert'
                    action = {() => {
                        handleSwap(quadrantPosition,'vertical')
                    }} />
                <ActionButton 
                    iconStyle = {{color:'green',transform:`rotate(${tilt})`}}
                    icon = 'swap_vert'
                    action = {() => {
                        handleSwap(quadrantPosition,'diagonal')
                    }} />
                </MenuItem>
            </PopupMenu>

        </div>

    }
}

export default withStyles(styles)(SwapMenu)
