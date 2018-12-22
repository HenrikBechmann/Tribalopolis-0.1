// menulist.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import React from 'react'

import { withRouter } from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Icon from '@material-ui/core/Icon'

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

export default MenuList
