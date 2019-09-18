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
    }

    private paneProxy:docproxy = null
    private datapanemessage:DataPaneMessage = null
    private accountsettingselement
    // private accountsettingselement:React.RefObject<HTMLDivElement> = React.createRef()
    // private calldowns

    // private registerCalldowns = (calldowns) => {
    //   this.calldowns = calldowns
    // }

    openDrawer = ({docproxy,options}:DataPaneMessage) => {

        if (this.state.draweropen) {
            toast.info('The data drawer is in use. Close the drawer and try again.')
            return
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
          // TransitionComponent={Transition} //broken with current release of material-ui v 4
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
                  <DataDrawer open = {this.state.draweropen}
                      handleClose = {this.closeDrawer}
                      containerelement = {this.accountsettingselement}
                  >
                  </DataDrawer>
                  <DataPane dataPaneMessage = {this.datapanemessage}/>
              </div>
          </div>
         </Dialog>
    }
}

export default withStyles(styles)(AccountDialog)
