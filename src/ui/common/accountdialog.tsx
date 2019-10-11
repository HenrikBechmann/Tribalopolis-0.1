// accountdialog.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import React from 'react'

import { toast } from 'react-toastify'

import { withStyles, createStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

import { DataPaneMessage, GenericObject } from '../../services/interfaces'
import docproxy from '../../utilities/docproxy'
import application from '../../services/application'
import DataPane from './datapane.view'
import DataDrawer from './datadrawer.view'
import LookupDrawer from './lookupdrawer.view'
import HelpDrawer from './helpdrawer.view'

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
        height:'65px',
    },
    datapanewrapper:{
        position:'relative',
        flex:1,
    },
})

interface DialogProps {
    closeSettings:any, // avoid complex type definiion. It's a function.
    userdata:GenericObject,
    systemdata:GenericObject,
    classes:GenericObject,
}

class AccountDialog extends React.Component<DialogProps,any> {

    constructor(props) {
      super(props)
      this.accountsettingselement = React.createRef() // must be set in constructor to avoid complex type defs
      this.setDatapaneMessage()
    }

    state = {
        settingsopen:true,
        draweropen:false,
        lookupopen:false,
    }

    private paneProxy:docproxy = null
    private datapanemessage:DataPaneMessage = null
    private accountsettingselement
    private drawerdata:DataPaneMessage
    private lookupdata:DataPaneMessage

    openDrawer = ({docproxy,options}:DataPaneMessage) => {

      console.log('openDrawer in accountdialog:docproxy, options',docproxy, options)

        if (this.state.draweropen) {
            toast.info('The data drawer is in use. Close the drawer and try again.')
            return
        }

        this.drawerdata = {
          docproxy,
          options,
          callbacks:{
              // close:this.props.closeSettings,
              // manage:this.openDrawer,
              submit:application.submitDocument,
          },
        }

        this.setState({
            draweropen:true,
        })

    }

    closeDrawer = () => {

        this.setState({
            draweropen:false,
        })

    }

    openLookup = ({docproxy,options}:DataPaneMessage) => {

        if (this.state.lookupopen) {
            toast.info('The lookup drawer is in use. Close the drawer and try again.')
            return
        }

        this.lookupdata = {
          docproxy,
          options,
          callbacks:{
              // close:this.props.closeSettings,
              // manage:this.openDrawer,
              // submit:application.submitDocument,
          },
        }

        this.setState({
            lookupopen:true,
        })

    }

    closeLookup = () => {

        this.setState({
            lookupopen:false,
        })

    }

    // the configuration data required for ui presentation (DataPane)
    setDatapaneMessage = () => {

        let accountsettingspageref = this.props.systemdata.parameters.properties.accountsettingspage

        if (accountsettingspageref) {
            let paneProxy = new docproxy({doctoken:{reference:accountsettingspageref}})

            this.paneProxy = paneProxy
            this.datapanemessage = {
                docproxy:paneProxy,
                options:{uiselection:'datapane'},
                callbacks:{
                    close:this.props.closeSettings,
                    manage:this.openDrawer,
                    submit:application.submitDocument,
                },
            }
        }

    }

    render() {
        let { classes } = this.props

        return  <Dialog
          fullScreen
          open
          onClose={this.props.closeSettings}
        >
          <div className = {classes.dialogliner}
              style = {{fontFamily:application.fontFamily}}
          >
              <AppBar>
                <Toolbar>
                  <IconButton color="inherit" onClick={this.props.closeSettings} aria-label="Close">
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h6" color="inherit" className={classes.flex}>
                    Account Settings
                  </Typography>
                  <Button color="inherit" onClick={this.props.closeSettings}>
                    Done
                  </Button>
                </Toolbar>
              </AppBar>
              <div className = {classes.datapaneoffset}></div>
              <div className = {classes.datapanewrapper}
                ref = {this.accountsettingselement}
              >
                  <HelpDrawer dataName = 'lookup-drawer' open = {this.state.draweropen}
                      handleClose = {this.closeDrawer}
                      containerelement = {this.accountsettingselement}
                  >
                    <DataPane active = {true} dataName = 'data-pane' dataPaneMessage = {this.lookupdata}/>
                  </HelpDrawer>
                   <LookupDrawer dataName = 'lookup-drawer' open = {this.state.draweropen}
                      handleClose = {this.closeDrawer}
                      containerelement = {this.accountsettingselement}
                  >
                    <DataPane active = {true} dataName = 'data-pane' dataPaneMessage = {this.lookupdata}/>
                  </LookupDrawer>
                  <DataDrawer dataName = 'data-drawer' open = {this.state.draweropen}
                      handleClose = {this.closeDrawer}
                      containerelement = {this.accountsettingselement}
                  >
                    <DataPane active = {true} dataName = 'data-pane' dataPaneMessage = {this.drawerdata}/>
                  </DataDrawer>
                  <DataPane active = {true} dataName = 'data-pane' dataPaneMessage = {this.datapanemessage}/>
              </div>
          </div>
         </Dialog>
    }
}

export default withStyles(styles)(AccountDialog)
