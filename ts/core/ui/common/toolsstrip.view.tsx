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

import application from '../../services/application'
import docproxy from '../../utilities/docproxy'
import { DataPaneMessage } from '../../services/interfaces'


const styles = createStyles({
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  dialogliner:{
      display:'flex',
      flexFlow:'column nowrap', 
      height:'100%',
  },
  datapaneoffset:{
      height:'55px',
  },
  datapanewrapper:{
      position:'relative',
      flex:1,
  },
})

function Transition(props) {
  return <Slide direction="left" {...props} />;
}

class ToolsStrip extends React.Component<any,any> {

    state = {
        menuopen:false,
        scroller:null,
        accountAnchorElement:null,
        userdata:this.props.userdata,
        systemdata:this.props.systemdata,
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
            if ((props.userdata != state.userdata)||(props.systemdata != state.systemdata)) {
                // console.log('toolsstrip state, props',state,props)
                return {
                    userdata:props.userdata,
                    systemdata:props.systemdata,
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
        application.signin()
    }

    handleLogout = () => {
        this.handleAccountClose()
        application.signout()
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

    paneProxy = null
    datapanemessage:DataPaneMessage = null

    accountSettingsDialog = (classes) => {
        if (!this.state.settingsopen) return null

        if (!this.paneProxy ) {
            let settingspageref = this.state.systemdata?this.state.systemdata.accountsettingspage:null
            // console.log('no pageProxy; settingspageref',settingspageref)
            if (settingspageref) {
                let paneProxy = new docproxy({doctoken:{reference:settingspageref}})
                // console.log('settingspageref available; pageProxy',settingspageref)
                this.paneProxy = paneProxy
                this.datapanemessage = {
                    docproxy:paneProxy,
                    options:{uiselection:'datapane'},
                    callbacks:{
                        close:this.closeSettings
                    }
                }
            }
        }
        // console.log('toolsstrip fontFamily',application.fontFamily)
        return  <Dialog
          fullScreen
          open={this.state.settingsopen}
          onClose={this.closeSettings}
          TransitionComponent={Transition}
        >
          <div className = {classes.dialogliner}
              style = {{fontFamily:application.fontFamily}}
          >
              <AppBar>
                <Toolbar>
                  <IconButton color="inherit" onClick={this.closeSettings} aria-label="Close">
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h6" color="inherit" className={classes.flex}>
                    Account Settings
                  </Typography>
                  <Button color="inherit" onClick={this.closeSettings}>
                    Done
                  </Button>
                </Toolbar>
              </AppBar>
              <div className = {classes.datapaneoffset}></div>
              <div className = {classes.datapanewrapper}>
                  <DataPane dataPaneMessage = {this.datapanemessage}/>
              </div>
          </div>
         </Dialog>
    }

    accountmenu = (classes) => {
        const { accountAnchorElement } = this.state
        // console.log('accountmenu',this.state.userdata)
        return <div style = {{display:'inline-block',verticalAlign:'middle',position:'relative'}}>
            <IconButton 
                aria-owns={accountAnchorElement ? 'simple-menu' : null}
                aria-haspopup="true"
                onClick={this.handleAccountClick}
              >
                <Icon style = {{color:!this.state.userdata?'rgb(0,0,0,0.54)':'cadetblue'}}>account_box</Icon>
                <Icon style = {{color:!this.state.userdata?'rgb(0,0,0,0.54)':'cadetblue'}}>arrow_drop_down</Icon>
            </IconButton>
            <div style = {
                {
                    display:'inline',
                    fontSize:'smaller',
                    color:'cadetblue',
                }}>
                {this.state.userdata?this.state.userdata.userpack.document.properties.username:'signed out'}
            </div>
            <Menu
                id="simple-menu"
                anchorEl={accountAnchorElement}
                open={Boolean(accountAnchorElement)}
                onClose={this.handleAccountClose}        
            >
                {!this.state.userdata?<MenuItem
                    onClick={this.handleLogin}
                >
                    Sign in using Google
                </MenuItem>:null}
                {this.state.userdata?<MenuItem
                    onClick = {this.openSettings}
                >
                    Account settings
                </MenuItem>:null}
                {this.state.userdata?<MenuItem
                    onClick={this.handleLogout}
                >
                    Sign out
                </MenuItem>:null}
            </Menu>
            {this.accountSettingsDialog(classes)}
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

export default withStyles(styles)(ToolsStrip)
