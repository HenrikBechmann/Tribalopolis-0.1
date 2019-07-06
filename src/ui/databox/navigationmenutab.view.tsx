// navigationmenutab.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon'

import Divider from '@material-ui/core/Divider'
import { toast } from 'react-toastify'

import ActionButton from '../common/actionbutton.view'

import { SetListenerMessage, RemoveListenerMessage, ReturnDocPairMessage } from '../../services/interfaces'

const styles = createStyles({
    tabstyles:{
        position:'absolute',
        right:'-38px',
        top:'-1px',
        width:'36px',
        border:'1px solid silver',
        backgroundColor:'#f2f2f2',
        borderRadius:'0 8px 8px 0',
    },
})

class NavigationMenuTab extends React.Component<any,any> {

    constructor(props){
        super(props)
        this.splaydomsource = React.createRef()
        this.selectdomsource = React.createRef()
        this.zoomdomsource = React.createRef()
        this.chat = React.createRef()
    }

    splaydomsource
    selectdomsource
    zoomdomsource
    chat
    isunmounting = false

    state = {
        list:null
    }

    listProxy

    componentDidUpdate() {
        if (!this.listProxy && this.props.listProxy) {
            this.listProxy = this.props.listProxy
            let parms:SetListenerMessage = 
                {
                    doctoken:this.listProxy.doctoken,
                    instanceid:this.listProxy.instanceid,
                    success:this.cacheListDocument,
                    failure:this.failCacheListDocument,
                }
            this.props.callbacks.setDocpackPairListener( parms )
        }
    }

    componentWillUnmount() {
        this.isunmounting = true
        if (this.listProxy) {
            let parms:RemoveListenerMessage = 
                {
                    doctoken:this.listProxy.doctoken,
                    instanceid:this.listProxy.instanceid,
                    // success:null,
                    // failure:null,
                }
            this.props.callbacks.removeDocpackPairListener( parms )
        }        
    }
    cacheListDocument = ({docpack, typepack, reason}:ReturnDocPairMessage) => {
        if (this.isunmounting) return
        this.setState({
            list:{
                document:docpack.document,
                type:typepack.document
            }
        })
    }

    failCacheListDocument = (error, reason) => {
        toast.error('error in navigationMenuTab:' + error)
        console.log('error in navigationMenuTab',error, reason)
    }

    expandFromSplay = () => {
        return () => {
            this.props.callbacks.expandFromSplay(this.selectdomsource.current)
        }
    }

    splayBox = () => {
        return () => {
            this.props.callbacks.splayBox(this.splaydomsource.current, this.state.list.document)
        }
    }

    render() {

        const { classes } = this.props

        let listcount = this.state.list?this.state.list.document.data.lists.length:0

        return (
            <div className = { classes.tabstyles } >
                <div className = {classes.splaybuttonwrapper}
                    ref = {this.splaydomsource}
                >
                    <ActionButton 
                        img = '/public/icons/ic_splay_24px.svg'
                        disabled = {!listcount} 
                        action = {this.splayBox()}
                    />
                </div>
                <div className = {classes.buttonwrapper}
                    ref = {this.selectdomsource}
                >
                    <ActionButton 
                        iconStyle = {{transform:'rotate(90deg)'}}
                        disabled = {!this.props.haspeers}
                        img = '/public/icons/ic_splay_24px.svg' 
                        action = {this.expandFromSplay()}
                    />
                </div>
                {true && <div className = {classes.buttonwrapper}
                    ref = {this.zoomdomsource}
                >
                    <ActionButton 
                        disabled
                        icon = 'zoom_out_map' 
                    />
                </div>}
                {false && <div className = {classes.buttonwrapper}
                    ref = {this.zoomdomsource}
                >
                    <ActionButton 
                        icon = 'expand_more' 
                    />
                </div>
                }
                <Divider style = {{float:'right',width:'100%'}}/>
                <div className = {classes.buttonwrapper}>
                    <ActionButton 
                        icon = 'arrow_back'
                        action = {this.props.collapseDirectoryItem}
                        disabled = {!this.props.liststack.length}
                    />
                </div>
                <Divider style = {{float:'right',width:'100%'}}/>
                <div className = {classes.buttonwrapper}
                    ref = {this.chat}
                >
                    <ActionButton 
                        action = { e => {this.props.callDataDrawer({docproxy:null,options:null})}}
                        icon = 'chat'
                    />
                </div>
            </div>
        )
    } 
}

export default withStyles( styles )( NavigationMenuTab )
