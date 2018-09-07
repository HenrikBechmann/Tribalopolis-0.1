// toolstrip.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
'use strict'

import * as React from 'react'

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

import ScrollControlsView from '../common/scrollcontrols.view'
import VerticalDivider from '../common/verticaldivider.view'

import authapi from '../../services/auth.api'


const MenuList = withRouter
(
    ({ history }) => {
        return (
        <List>
            <ListItem button
                disabled
            > 
                <ListItemIcon> 
                    <Icon 
                        style = {{color:'brown'}}
                    >
                        weekend
                    </Icon>
                </ListItemIcon>
                <ListItemText primary = "Home Base" />
            </ListItem>
            <Divider />
            <ListItem button
                disabled
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
                <ListItemText primary = "Members" />
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
        currentQuadPosition:this.props.currentQuadPosition,
        split:this.props.split,
        accountAnchorElement:null,
        user:null,
    }

    changeSplit = this.props.callbacks.changeSplit

    selectQuad = this.props.callbacks.selectQuad

    scroller = null

    componentDidMount() {
        setTimeout(()=>{
            this.setState({
                scroller:this.scroller
            })
        },500) // substantial timeout required to give scroll client time to right-size
    }

    componentDidUpdate() {
        if (this.props.currentQuadPosition !== this.state.currentQuadPosition ||
            this.props.split != this.state.split || this.props.user != this.state.user) {
            this.setState({
                currentQuadPosition:this.props.currentQuadPosition,
                split:this.props.split,
                user:this.props.user,
            })
        }
    }

    changeSplitFrom = (toggleIndex) => {
        let newIndex = null
        if (toggleIndex == this.state.split) {
            newIndex = 'none'
        } else {
            newIndex = toggleIndex
        }
        this.changeSplit(newIndex)
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
                    onClick={this.handleLogout}
                >
                    Sign out
                </MenuItem>:null}
            </Menu>
        </div>
    }

    quadnavigationmenu = () => {
        let { currentQuadPosition, split } = this.state
        return <div style = {{display:'inline-block',verticalAlign:'middle'}}>
            <IconButton
                style = {{verticalAlign:'bottom',}}
                onClick = {() => {
                    this.selectQuad('topleft')
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
                    this.selectQuad('topright')
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
                    this.selectQuad('bottomleft')
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
                    this.selectQuad('bottomright')
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

    splitnavigationmenu = () => {
        return <div style = {{display:'inline-block',verticalAlign:'middle'}}>
            <IconButton
                style = {{verticalAlign:'bottom'}}
                onClick = {() => this.changeSplitFrom('horizontal')}
            >
                <img 
                    src = {
                        (this.state.split == 'horizontal')?
                            '/public/icons/ic_border_all_black_24px_split_red.svg':
                            '/public/icons/ic_border_all_black_24px_split.svg'
                    }
                />
            </IconButton>

            <IconButton
                style = {{verticalAlign:'bottom'}}
                onClick = {() => this.changeSplitFrom('vertical')}
            >
                <img 
                    style = {{transform:'rotate(90deg)'}}
                    src = {
                        (this.state.split == 'vertical')?
                            '/public/icons/ic_border_all_black_24px_split_red.svg':
                            '/public/icons/ic_border_all_black_24px_split.svg'
                    }
                />
            </IconButton>

            <IconButton
                style = {{verticalAlign:'bottom'}}
                onClick = {() => this.changeSplitFrom('matrix')}
            >
                <img 
                    src = {
                        (this.state.split == 'matrix')?
                            '/public/icons/ic_border_all_black_24px_split_matrix_red.svg':
                            '/public/icons/ic_border_all_black_24px_split_matrix.svg'
                    }
                />
            </IconButton>
        </div>
    }

    render() {
        return (
            <div 
                style = {
                    {
                        height:'48px',
                        backgroundColor:'silver',
                        position:'absolute',
                        top:0,
                        left:0,
                        right:'96px'
                    }
                } 
            >
                <ScrollControlsView uid='scrollcontrolsview' scroller = {this.state.scroller} >
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

                            {this.quadnavigationmenu()}

                            <VerticalDivider />

                            {this.splitnavigationmenu()}

                            <VerticalDivider />

                            <IconButton 
                            >
                                <Icon>notifications</Icon>
                            </IconButton>

                            <IconButton
                            >
                                <Icon>help_outline</Icon>
                            </IconButton>

                            <IconButton
                            >
                                <Icon>settings</Icon>
                            </IconButton>

                            { this.accountmenu() }

                            { this.menudrawer() }

                        </div>
                    </div>
                </ScrollControlsView>
            </div>
        )
    }

}

export default QuadToolsStrip