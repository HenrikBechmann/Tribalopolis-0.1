// build.controller.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import StandardToolbar from '../common/standardtoolbar.view'
// import UserAccountActiveControls from '../services/useraccount.controldata'

import administration from '../../services/application'
import docproxy from '../../utilities/docproxy'
import DataPane from '../common/datapane.view'

class Register extends React.Component<any,any> {

    paneProxy

    datapanecontext

    registerform = () => {
        if (!this.paneProxy ) {

            let registerpageref = administration.systemdata?administration.systemdata.parameters.properties.registerpage:null

            if (registerpageref) {
                let paneProxy = new docproxy({doctoken:{reference:registerpageref}})

                this.paneProxy = paneProxy
                this.datapanecontext = {
                    docproxy:paneProxy,
                    options:{uiselection:'datapane'},
                    callbacks:{
                        // close:this.props.closeSettings,
                        // manage:this.openDrawer,
                    }
                }
            }
        }
        return <div style = {
            {
                flex:1,
                position:'relative',
            }
        }>
            <DataPane dataPaneContext = {this.datapanecontext}/>
        </div>

    }

    render() {
        let { userdata } = administration
        return (
            <div style = {
                {
                    display:'flex',
                    flexFlow:'column nowrap',
                    position:'fixed',
                    top:0,
                    right:0,
                    bottom:0,
                    left:0,
                }
            }>
                <div><StandardToolbar /></div>
                <div style = {
                    {
                        display:'flex',
                        flexFlow:'column nowrap',
                        flex:1
                    }
                }>
                {
                    (userdata.status == 'loggedin') && (
                        <React.Fragment>
                        <p>Thanks for logging in! Now just register using the scrolling form below, and you'll be all set. [pending]</p>
                        {this.registerform()}
                        </React.Fragment>
                    )
                }
                {(userdata.status == 'registered-user') && <p>Thanks for logging in! Now just finish registering here and you'll be all set. [pending]</p>}
                {(userdata.status == 'signedout') && <p>Please sign in to register.</p>}
                {((userdata.status == 'registered') || (userdata.status == 'active')) && <p>You're already registered. Nothing to do here.</p>}
                </div>
            </div>
        )
    }
}

export default Register