// directorybarholder.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import { toast } from 'react-toastify'

import DirectoryBar from './directorybar.view'
import docproxy from '../../utilities/docproxy'

import LoadingMessage from '../common/loadingmessage.view'

import { SetListenerMessage, RemoveListenerMessage, DocpackPairPayloadMessage } from '../../services/interfaces'

const styles = createStyles({
    holderstyle:{
        boxSizing:'border-box',
        height:'24px',
        borderRadius:'8px',
        backgroundColor:'#c7ddc7',
    },
})

class RootDirectoryBarHolder extends React.Component<any, any> {

    state = {
        item:null,
    }

    itemProxy

    componentDidMount() {
        this.assertListener()
    }

    componentDidUpdate() {
        this.assertListener()
    } 

    assertListener = () => {
        if (!this.itemProxy && this.props.itemProxy) {

            this.itemProxy = this.props.itemProxy
            let parms:SetListenerMessage = 
                {
                    doctoken:this.itemProxy.doctoken,
                    instanceid:this.itemProxy.instanceid,
                    success:this.cacheItemDocument,
                    failure:this.failCacheItemDocument,
                }
            this.props.setDocpackPairListener( parms )
        }        
    }

    componentWillUnmount() {
        if (this.itemProxy) {
            let parms: RemoveListenerMessage = 
                {
                    doctoken:this.itemProxy.doctoken,
                    instanceid:this.itemProxy.instanceid,
                    // success:null,
                    // failure:null,
                }
            this.props.removeDocpackPairListener( parms )
        }        
    }

    cacheItemDocument = ({docpack, typepack, reason}:DocpackPairPayloadMessage) => {

        this.setState({
            item:{
                docpack,
                typepack,
            }
        })
    }

    failCacheItemDocument = (error, reason) => {
        toast.error('error in rootdirectorybarholder: ' + error)
        console.log('error in rootdirectorybarholder',error, reason)
    }

    render() {

    let { classes } = this.props
    let listProxy
    if (this.state.item) {
        let listtoken = {
            reference:'lists/' + this.state.item.docpack.document.references.list,
            // collection:'lists', 
            // id:this.state.item.document.references.list,
        }
        listProxy = new docproxy({doctoken:listtoken})
    }

    return (
    this.state.item?
    <DirectoryBar 
        haspeers = {false}
        listProxy = {listProxy}
        setDocpackPairListener = {this.props.setDocpackPairListener}
        removeDocpackPairListener = {this.props.removeDocpackPairListener}
        callDataDrawer = {this.props.callDataDrawer}

        listStack = {this.itemProxy.liststack}
        collapseDirectoryItem = {() => {}} 
        contextitem
    
    />    
    :<div className = {classes.holderstyle}>
        <LoadingMessage />
    </div>)
    }
}

export default withStyles(styles)(RootDirectoryBarHolder)
