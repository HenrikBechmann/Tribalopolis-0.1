// toolstrip.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import React from 'react'

import { withRouter } from 'react-router-dom'
// for toolbar menus
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

// for drawer menus
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import ToolTip from '@material-ui/core/Tooltip'

import ScrollControlsView from '../common/scrollcontrols.view'
import VerticalDivider from '../common/verticaldivider.view'

import authapi from '../../services/auth.api'

const MenuList = withRouter
(
    (routerdata) => {
        let { history, location } = routerdata
        let { pathname } = location // to highlight current location in menu
        return (
        <List>
            <ListItem button
                onClick = {() => history.push('/')}
                style = {
                    {
                        border:(pathname == "/")?'2px solid lightblue':'2px solid transparent',
                        backgroundColor:(pathname == "/")?'lightyellow':'transparent',
                    }
                }
            > 
                <ListItemIcon> 
                    <img
                        src='/public/icons/fire.svg'
                    />
                </ListItemIcon>
                <ListItemText primary = "Home" />
            </ListItem>
            <Divider />
            <ListItem button
                onClick = {() => history.push('/workspace')}
                style = {
                    {
                        border:(pathname == "/workspace")?'2px solid lightblue':'2px solid transparent',
                        backgroundColor:(pathname == "/workspace")?'lightyellow':'transparent',
                    }
                }
            >
                <ListItemIcon>
                    <Icon 
                        style = {{color:'brown'}}
                    >
                        work
                    </Icon>
                </ListItemIcon>
                <ListItemText primary = "My Workspace"/>
            </ListItem>
            <ListItem button
                disabled
            >
                <ListItemIcon>
                    <Icon 
                        style = {{color:'brown'}}
                    >
                        account_box
                    </Icon>
                </ListItemIcon>
                <ListItemText primary = "My Account" />
            </ListItem>
            <ListItem button
                disabled
            >
                <ListItemIcon>
                    <Icon 
                        style = {{color:'brown'}}
                    >
                        web
                    </Icon>
                </ListItemIcon>
                <ListItemText primary = "My Website" />
            </ListItem>
            <Divider />
            <ListItem button
                disabled
            >
                <ListItemIcon>
                    <Icon 
                        style = {{color:'steelblue'}}
                    >
                        group
                    </Icon>
                </ListItemIcon>
                <ListItemText primary = "Users" />
            </ListItem>
            <ListItem button
                disabled
            >
                <ListItemIcon>
                    <img
                       src='/public/icons/fire.svg'
                    />
                </ListItemIcon>
                <ListItemText primary = "Tribes" />
            </ListItem>
            <ListItem button
                disabled
            >
                <ListItemIcon>
                    <Icon 
                        style = {{color:'steelblue'}}
                    >
                        share
                    </Icon>
                </ListItemIcon>
                <ListItemText primary = "Networks" />
            </ListItem>
            <ListItem button
                disabled
            >
                <ListItemIcon>
                    <Icon 
                        style = {{color:'brown'}}
                    >
                        group_work
                    </Icon>
                </ListItemIcon>
                <ListItemText primary = "Commons" />
            </ListItem>
            <ListItem button
                disabled
            >
                <ListItemIcon>
                    <Icon 
                        style = {{color:'green'}}
                    >
                        monetization_on
                    </Icon>
                </ListItemIcon>
                <ListItemText primary = "Markets" />
            </ListItem>
            <Divider />
            <ListItem button
                disabled
            >
                <ListItemIcon>
                    <Icon>local_library</Icon>
                </ListItemIcon>
                <ListItemText primary = "Tutorials" />
            </ListItem>
            <ListItem button
                onClick = {() => history.push('/build')}
                style = {
                    {
                        border:(pathname == "/build")?'2px solid lightblue':'2px solid transparent',
                        backgroundColor:(pathname == "/build")?'lightyellow':'transparent',
                    }
                }
            >
                <ListItemIcon>
                    <Icon className='material-icons'>build</Icon>
                </ListItemIcon>
                <ListItemText primary = "Build" />
            </ListItem>
            <Divider />
            <ListItem button
                disabled
            >
                <ListItemIcon>
                    <img
                        src='/public/icons/fire.svg'
                    />
                </ListItemIcon>
                <ListItemText primary = "About" />
            </ListItem>
        </List>
        )
    }
)

class QuadToolsStrip extends React.Component<any,any> {

    state = {
        menuopen:false,
        scroller:null,
        accountAnchorElement:null,
        user:this.props.user,
    }

    scroller = null

    componentDidMount() {
        setTimeout(()=>{
            this.setState({
                scroller:this.scroller
            })
        },500) // substantial timeout required to give scroll client time to right-size
    }

    componentDidUpdate() {
        this.setState((state,props) => {
            if (props.user != state.user) {
                return {
                    user:props.user,
                }
            }
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
                <MenuList />
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
        authapi.googlesignin()
    }

    handleLogout = () => {
        this.handleAccountClose()
        authapi.googlesignout()
    }

    accountmenu = () => {
        const { accountAnchorElement } = this.state
        return <div style = {{display:'inline-block',verticalAlign:'middle',position:'relative'}}>
            <IconButton 
                aria-owns={accountAnchorElement ? 'simple-menu' : null}
                aria-haspopup="true"
                onClick={this.handleAccountClick}
              >
                <Icon style = {{color:!this.state.user?'rgb(0,0,0,0.54)':'cadetblue'}}>account_box</Icon>
            </IconButton>
            <div style = {
                {
                    display:'inline',
                    fontSize:'smaller',
                    color:'cadetblue',
                }}>
                {this.state.user?this.state.user.displayName:'not signed in'}
            </div>
            <Menu
                id="simple-menu"
                anchorEl={accountAnchorElement}
                open={Boolean(accountAnchorElement)}
                onClose={this.handleAccountClose}        
            >
                {!this.state.user?<MenuItem
                    onClick={this.handleLogin}
                >
                    Sign in using Google
                </MenuItem>:null}
                {this.state.user?<MenuItem
                >
                    Account settings
                </MenuItem>:null}
                {this.state.user?<MenuItem
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
            backgroundColor:'silver',
            position:'absolute',
            top:0,
            left:0,
            right:0,
        }

    render() {
        let wrapperstyle = {...this.defaultstyle,...this.props.style}
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
                                onClick = {this.toggleDrawer(!this.state.menuopen)}
                            >
                                <Icon>menu</Icon>
                            </IconButton>

                            <VerticalDivider />

                            {(this.props.childrenposition == 'middle') &&
                                this.props.children
                            }
                            <ToolTip title = 'Notifications'>
                            <IconButton 
                            >
                                <Icon>notifications</Icon>
                            </IconButton>
                            </ToolTip>

                            {false && <IconButton
                            >
                                <Icon>apps</Icon>
                            </IconButton>}
                            <ToolTip title = 'Settings'>
                            <IconButton
                            >
                                <Icon>settings</Icon>
                            </IconButton>
                            </ToolTip>

                            <ToolTip title = 'Help'>
                            <IconButton
                            >
                                <Icon>help_outline</Icon>
                            </IconButton>
                            </ToolTip>

                            <VerticalDivider />

                            { this.accountmenu() }

                            {(this.props.childrenposition == 'end') &&
                                this.props.children
                            }

                            { this.menudrawer() }

                        </div>
                    </div>
                </ScrollControlsView>
            </div>
        )
    }

}

export default QuadToolsStrip