// toolstrip.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import React from 'react'

import { withRouter } from 'react-router-dom'
// for toolbar menus
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Dialog from '@material-ui/core/Dialog'
import Slide from '@material-ui/core/Slide'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close'
import { withStyles, createStyles } from '@material-ui/core/styles'

// for drawer menus
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import ToolTip from '@material-ui/core/Tooltip'

import MenuList from './menulist'
import ScrollControlsView from '../common/scrollcontrols.view'
import VerticalDivider from '../common/verticaldivider.view'
import DataPane from './datapane.view'

import authapi from '../../services/auth.api'

const styles = createStyles({
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
})

function Transition(props) {
  return <Slide direction="left" {...props} />;
}

class QuadToolsStrip extends React.Component<any,any> {

    state = {
        menuopen:false,
        scroller:null,
        accountAnchorElement:null,
        user:this.props.user,
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

    componentDidUpdate() {
        this.setState((state,props) => {
            if (props.user != state.user) {
                // console.log('toolsstrip state, props',state,props)
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

    settingsDialog = (classes) => {

        return  <Dialog
          fullScreen
          open={this.state.settingsopen}
          onClose={this.closeSettings}
          TransitionComponent={Transition}
        >
          <div style = {{display:'flex',flexFlow:'column nowrap', height:'100%'}}>
              <AppBar>
                <Toolbar>
                  <IconButton color="inherit" onClick={this.closeSettings} aria-label="Close">
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h6" color="inherit" className={classes.flex}>
                    Account Settings
                  </Typography>
                  <Button color="inherit" onClick={this.closeSettings}>
                    save
                  </Button>
                </Toolbar>
              </AppBar>
              <div style = {{height:'55px'}}></div>
              <div style = {{position:'relative',flex:1}}>
                  <DataPane />
              </div>
          </div>
         </Dialog>
    }

    accountmenu = (classes) => {
        const { accountAnchorElement } = this.state
        // console.log('accountmenu',this.state.user)
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
                {this.state.user?this.state.user.userpack.document.properties.username:'signed out'}
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
                    onClick = {this.openSettings}
                >
                    Account settings
                </MenuItem>:null}
                {this.state.user?<MenuItem
                    onClick={this.handleLogout}
                >
                    Sign out
                </MenuItem>:null}
            </Menu>
            {this.settingsDialog(classes)}
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
        let { classes } = this.props
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
                            <ToolTip title = 'Application Settings'>
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

                            { this.accountmenu(classes) }

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

export default withStyles(styles)(QuadToolsStrip)