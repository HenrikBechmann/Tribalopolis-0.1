// toolstrip.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import React from 'react'

// import { withRouter } from 'react-router-dom'
// for toolbar menus
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
// for drawer menus
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import ToolTip from '@material-ui/core/Tooltip'

import MenuList from './menulist'
import ScrollControlsView from '../common/scrollcontrols.view'
import VerticalDivider from '../common/verticaldivider.view'

import application from '../../services/application'

import AccountDialog from './accountdialog'

class ToolsStrip extends React.Component<any,any> {

    state = {
        menuopen:false,
        scroller:null,
        accountAnchorElement:null,
        settingsopen:false,
    }

    scroller = null

    componentDidMount() {
        setTimeout(()=>{
            this.setState({
                scroller:this.scroller
            })
        },500) // substantial timeout required to give scroll client time to right-size
    }

    componentDidUpdate(prevProps, prevState) {

        if ((this.props.userdata.userpack != prevProps.userdata.userpack)||(this.props.systemdata != prevProps.systemdata)) {
            this.forceUpdate()
        }
    }

    openSettings = () => {

        this.setState({
            accountAnchorElement: null,
            settingsopen:true,
        })

    }

    closeSettings = () => {
        this.setState({ 
            settingsopen: false,
        })
    }

    toggleDrawer = (open) => () => {
        this.setState({
            menuopen:open,
        })
    }

    menudrawer = () => {

        return (
        <Drawer
            open={this.state.menuopen}
            onClose={this.toggleDrawer(false)}
        >
            <div
                tabIndex={0}
                role="button"
                onClick={this.toggleDrawer(false)}
                onKeyDown={this.toggleDrawer(false)}
            >
                <MenuList openSettings = {this.openSettings} />
            </div>
        </Drawer>
    )}

    handleAccountClick = event => {
        this.setState({ accountAnchorElement: event.currentTarget });
    }

    handleAccountClose = () => {
        this.setState({ accountAnchorElement: null });
    }

    handleLogin = () => {
        this.handleAccountClose()
        application.signin()
    }

    handleLogout = () => {
        this.handleAccountClose()
        application.signout()
    }

    // pass docproxy, options, callbacks

    accountmenu = (classes) => {
        const { accountAnchorElement } = this.state
        let { userdata } = this.props
        // console.log('accountmenu',userdata, userdata.status)
        return <div style = {{display:'inline-block',verticalAlign:'middle',position:'relative'}}>
            {userdata.loginstatus != 'loggedout' && <div>
            {userdata.loginstatus == 'loggedin' && <ToolTip title = 'User Account'>
            <IconButton 
                aria-owns={accountAnchorElement ? 'simple-menu' : null}
                aria-haspopup="true"
                onClick={this.handleAccountClick}
              >
                <Icon style = {{color:!(userdata.status == 'active')?'rgb(0,0,0,0.54)':'cadetblue'}}>account_box</Icon>
                <Icon style = {{color:!(userdata.status == 'active')?'rgb(0,0,0,0.54)':'cadetblue'}}>arrow_drop_down</Icon>
            </IconButton>
            </ToolTip>}
            <div style = {
                {
                    display:'inline',
                    fontSize:'smaller',
                    color:'cadetblue',
                }}>

                {(userdata.loginstatus == 'unresolved') && '(Resolving login status)'}
                {(userdata.loginstatus != 'unresolved') && ((userdata.status == 'active')? // use account name if available
                    userdata.userpack.document.properties.username:
                    ((userdata.status == 'loggedin')||(userdata.status == 'registered-user'))? // otherwise try to use login data
                    ('Please register! ' + this.props.userdata.login.displayName):
                    (userdata.status == 'registered')?'Inactive account: ' + this.props.userdata.login.email:
                    'signed out')}

            </div>
            </div>}
            {(userdata.loginstatus == 'loggedout') && 
            <Button 
                variant = 'contained'
                onClick = {this.handleLogin}
            >
               Sign in using Google
            </Button>}
            <Menu
                id="simple-menu"
                anchorEl={accountAnchorElement}
                open={Boolean(accountAnchorElement)}
                onClose={this.handleAccountClose}        
            >
                {!userdata.isloggedin?<MenuItem
                    onClick={this.handleLogin}
                >
                    Sign in using Google
                </MenuItem>:null}
                {(userdata.status == 'active')?<MenuItem
                    onClick = {this.openSettings}
                >
                    Account settings
                </MenuItem>:null}
                {((userdata.status == 'loggedin')||(userdata.status == 'registered-user'))?<MenuItem disabled
                    onClick={null}
                >
                    Register
                </MenuItem>:null}
                {(userdata.status == 'registered')?<MenuItem disabled
                    onClick={null}
                >
                    Check Status
                </MenuItem>:null}
                {userdata.isloggedin?<MenuItem
                    onClick={this.handleLogout}
                >
                    Sign out
                </MenuItem>:null}
            </Menu>

        </div>
    }

    defaultstyle = 
        {
            height:'48px',
            backgroundColor:'gainsboro',
            position:'absolute',
            top:0,
            left:0,
            right:0,
            zIndex:1,
        }

    render() {
        let wrapperstyle = {...this.defaultstyle,...this.props.style}
        let { classes, userdata } = this.props
        return (
            <div 
                style = {
                   wrapperstyle
                } 
            >
                <ScrollControlsView scroller = {this.state.scroller} >
                    <div style = {
                        {
                            display:'flex',
                            flexWrap:'nowrap',
                            overflow:'auto',
                        }
                    }
                        
                        ref = {el => {
                            this.scroller = el
                        }}
                    >
                        <div 
                            style = {
                                {
                                    display:'inline',
                                    whiteSpace:'nowrap',
                                }
                            }
                        >
                            <IconButton
                                disabled = {(userdata.status == 'loggedin')||(userdata.status == 'registered-user')}
                                onClick = {this.toggleDrawer(!this.state.menuopen)}
                            >
                                <Icon>menu</Icon>
                            </IconButton>

                            <VerticalDivider />

                            {(this.props.childrenposition == 'middle') &&
                                this.props.children
                            }
                            <IconButton 
                                disabled = {(userdata.status == 'loggedin')||(userdata.status == 'registered-user')}
                            >
                                <Icon>notifications</Icon>
                            </IconButton>
                            {false && <IconButton
                            >
                                <Icon>apps</Icon>
                            </IconButton>}
                            {false && <ToolTip title = 'Application Settings'>
                            <IconButton
                            >
                                <Icon>settings</Icon>
                            </IconButton>
                            </ToolTip>}
                            <ToolTip title = 'Help'>
                            <IconButton
                            >
                                <Icon>help_outline</Icon>
                            </IconButton>
                            </ToolTip>

                            {false && <VerticalDivider />}

                            { this.accountmenu(classes) }

                            {(this.props.childrenposition == 'end') &&
                                this.props.children
                            }

                            { this.menudrawer() }

                            {
                                this.state.settingsopen && <AccountDialog 
                                    closeSettings = {this.closeSettings}
                                    userdata = {this.props.userdata}
                                    systemdata = {this.props.systemdata}
                                />
                            }

                        </div>
                    </div>
                </ScrollControlsView>
            </div>
        )
    }

}

export default ToolsStrip
