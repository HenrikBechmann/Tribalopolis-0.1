// accountdialog.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog'
import Slide from '@material-ui/core/Slide'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

import { DataPaneContext } from '../../services/interfaces'
import docproxy from '../../utilities/docproxy'
import application from '../../services/application'
import DataPane from './datapane.view'

function Transition(props) {
  return <Slide direction="left" {...props} />;
}

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

interface DialogProps {
    closeSettings:any,
    userdata:AnyObject,
    systemdata:AnyObject,
    classes:AnyObject,
}

interface AnyObject {
    [name:string]:any,
}

class AccountDialogBase extends React.Component<DialogProps,any> {

    private paneProxy = null

    private datapanecontext:DataPaneContext = null

    state = {
        settingsopen:true,
    }

    componentWillUnmount() {
        console.log('unmounting account dialog: props, state',this.props,this.state)
    }

    render() {
        if (!this.paneProxy ) {

            let settingspageref = this.props.systemdata?this.props.systemdata.accountsettingspage:null

            if (settingspageref) {
                let paneProxy = new docproxy({doctoken:{reference:settingspageref}})

                this.paneProxy = paneProxy
                this.datapanecontext = {
                    docproxy:paneProxy,
                    options:{uiselection:'datapane'},
                    callbacks:{
                        close:this.props.closeSettings
                    }
                }
            }
        }

        let { classes } = this.props
        return  <Dialog
          fullScreen
          open={ true } // TESTING this.state.settingsopen}
          onClose={this.props.closeSettings}
          TransitionComponent={Transition}
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
              <div className = {classes.datapanewrapper}>
                  <DataPane dataPaneContext = {this.datapanecontext}/>
              </div>
          </div>
         </Dialog>
    }
}

export default withStyles(styles) (AccountDialogBase)
