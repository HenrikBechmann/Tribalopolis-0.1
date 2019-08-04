// menulist.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import React from 'react'

import { withRouter } from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Icon from '@material-ui/core/Icon'

// import UserDataContext from '../../services/userdata.context'
// import SystemDataContext from '../../services/systemdata.context'
import UserAccountActiveControls from '../../services/useraccount.activecontrols'
// import AccountDialog from './accountdialog'
import DescriptiveDivider from './descriptivedivider.view'

class MenuListBase extends React.Component<any,any> {
    state = {
        settingsopen:false
    }

    render() {

    let history = this.props.history
    let location = this.props.location
    // let match = this.props.match // TODO investigate
    let { pathname } = location // to highlight current location in menu

    return (
        <UserAccountActiveControls>
        { (systemdata,userdata, activeaccountdata, activememberdata) => {
            // console.log('menulist useraccount control data',systemdata,userdata,activeaccountdata,activememberdata)
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
                <DescriptiveDivider description = 'Personal' />
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
                            web
                        </Icon>
                    </ListItemIcon>
                    <ListItemText primary = "My Website" />
                </ListItem>
                <ListItem button
                    disabled = {!(userdata.status == 'active')}
                    onClick = {this.props.openSettings}
                    style = {
                        {
                            border:'2px solid transparent',
                            backgroundColor:'transparent',
                        }
                    }
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
                <DescriptiveDivider description = 'Social' />
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
                    <ListItemText primary = "Tribalopolis Users" />
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
                <DescriptiveDivider description = 'Creative' />
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
                <DescriptiveDivider description = 'Tribalopolis' />
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
                {false && <ListItem button
                    disabled
                >
                    <ListItemIcon>
                        <Icon className='material-icons'>contacts</Icon>
                    </ListItemIcon>
                    <ListItemText primary = "Contacts" />
                </ListItem>}
            </List>
        )}}
        </UserAccountActiveControls>
    )}
}

const MenuList = withRouter(MenuListBase)

export default MenuList
