// toolstrip.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import Divider from 'material-ui/Divider'
import MenuItem from 'material-ui/MenuItem'
import Drawer from 'material-ui/Drawer'

class QuadToolsStrip extends React.Component<any,any> {

    state = {
        menuopen:false,
    }

    handleMenuToggle = () => {
        this.setState({menuopen: !this.state.menuopen}
    )}

    handleMenuClose = () => this.setState({menuopen: false});

    spacemenu = <div style = {
            {
                display:'inline-block',
                whiteSpace:'nowrap'
            }
        }
    >
        <IconButton
            tooltip = 'reset back to first origin'
        >
            <FontIcon className='material-icons'>home</FontIcon>
        </IconButton>
        <IconButton
            disabled
            tooltip = 'navigate back one step to origin fields'
        >
            <FontIcon className='material-icons'>undo</FontIcon>
        </IconButton>
        <IconButton
            disabled
            tooltip = 'navigate forward one step to previously selected field list'
        >
            <FontIcon className='material-icons'>redo</FontIcon>
        </IconButton>
        <IconButton
            disabled
            tooltip = 'fitler current field list'
        >
            <FontIcon className='material-icons'>filter_list</FontIcon>
        </IconButton>
        <IconButton
            tooltip = 'swap current quadrant horizontally'
        >
            <FontIcon className='material-icons'>swap_horiz</FontIcon>
        </IconButton>
        <IconButton
            tooltip = 'swap current quadrant vertically'
        >
            <FontIcon className='material-icons'>swap_vert</FontIcon>
        </IconButton>
    </div>

    spaceoverflowmenu = <IconMenu
            iconButtonElement = {
                <IconButton>
                    <FontIcon className='material-icons'>more_vert</FontIcon>
                </IconButton>
            }
            anchorOrigin = {{vertical:"bottom",horizontal:"right"}}
            targetOrigin = {{vertical:"top",horizontal:"right"}}
        >
            <MenuItem
                leftIcon = {<FontIcon className='material-icons'>refresh</FontIcon>}
                primaryText = "Refresh"
            />
            <MenuItem
                leftIcon = {<FontIcon className='material-icons'>settings</FontIcon>}
                primaryText = "Options"
            />
            <MenuItem
                leftIcon = {<FontIcon className='material-icons'>help</FontIcon>}
                primaryText = "Help"
            />
        </IconMenu>

    menudrawer = () => (<Drawer
                docked={false}
                open={this.state.menuopen}
                onRequestChange={(open) => this.setState({menuopen:open})}
            >
                <MenuItem 
                    leftIcon = {
                        <img
                            src='/public/icons/campfire.svg'
                        />
                    }
                    primaryText = "About"
                    onClick={this.handleMenuClose}
                />
                <MenuItem 
                    leftIcon = {
                        <FontIcon className='material-icons'>local_library</FontIcon>
                    }
                    primaryText = "Tutorials"
                    onClick={this.handleMenuClose}
                />
                <MenuItem 
                    leftIcon = {
                        <FontIcon className='material-icons'>build</FontIcon>
                    }
                    primaryText = "Build"
                    onClick={this.handleMenuClose}
                />
            </Drawer>
        )

    accountmenu = <IconMenu
            iconButtonElement = {
                <IconButton>
                    <FontIcon className='material-icons'>account_circle</FontIcon>
                </IconButton>
            }
            anchorOrigin = {{vertical:"bottom",horizontal:"right"}}
            targetOrigin = {{vertical:"top",horizontal:"right"}}
        >
            <MenuItem
                primaryText = "Login (existing user)"
            />
            <Divider />
            <MenuItem
                primaryText = "Register (new user)"
            />
        </IconMenu>

    render() {
        return (
            <div 
                style = {
                    {
                        height:'48px',
                        backgroundColor:'silver',
                        position:'absolute',
                        top:'0',
                        left:'0',
                        right:'96px'
                    }
                } 
            >
                <div style = {{display:'inline-block',whiteSpace:'nowrap'}}>
                    <IconButton
                        onClick = {this.handleMenuToggle}
                    >
                        <FontIcon className='material-icons'>menu</FontIcon>
                    </IconButton>

                    { this.spacemenu }

                    { this.spaceoverflowmenu }

                    { this.accountmenu }

                    {this.menudrawer()}
                </div>

            </div>
        )
    }

}

export default QuadToolsStrip