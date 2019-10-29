// boxheader.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later
'use strict'

import React from 'react'

import Icon from '@material-ui/core/Icon'
import Info from '@material-ui/icons/InfoOutlined'
import { withStyles, createStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem';
import { toast } from 'react-toastify'

import ActionButton from '../common/actionbutton.view'
import PopupMenu from '../common/popupmenu.view'

import { SetListenerMessage, RemoveListenerMessage, DocpackPairPayloadMessage } from '../../services/interfaces'

const styles = createStyles({
    barstyle:{
        boxSizing:'border-box',
        position:'relative',
        borderBottom:'1px solid #e2e6e9',

        borderRadius:'8px 8px 0 0 ',
        backgroundColor:'#c7ddc7',
    },
    rowstyle:{
        position:'relative',
        padding:'3px',
        display:'flex',
        flexFlow:'row nowrap',
        alignItems:'center',
        cursor:'pointer',
        height:'32px',
    },
    namestyle:{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        paddingLeft:'3px',
        whiteSpace:'nowrap',
        flex:1,
    },
    avatar:{
        verticalAlign:'middle',
        width:'24px', 
        marginRight:'3px'
    },
    databox:{
        verticalAlign:'middle',
        width:'24px', 
        marginRight:'3px'
    },

})

class IdentityBar extends React.Component<any, any> {

    constructor(props) {
        super(props)
        this.menuAnchor = React.createRef()
    }

    state = {
        item:null,
        menuopen:false,
    }

    itemProxy
    menuAnchor

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
            let parms:RemoveListenerMessage = 
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
        toast.error('error in identitybar:' + error)
        console.log('error in identitybar',error, reason)
    }

    toggleMenu = (e) => {
        e.stopPropagation()
        this.setState(state => ({ menuopen: !state.menuopen }));
    }

    menuClose = event => {
        event.stopPropagation()
        if (this.menuAnchor.current.contains(event.target)) {
          return;
        }

        this.setState({ menuopen: false });
    }

    callDataDrawer = (e,opcode) => {
        this.menuClose(e)
        this.props.callDataDrawer({docproxy:this.itemProxy, opcode})
    }

    render() {

    let { classes, contextitem } = this.props

    let avatar = '/public/avatars/henrik_in_circle.png'
    let databox = "/public/icons/databox.svg"

    return <div className = {classes.barstyle}>
        <div 
            className = {classes.rowstyle}
            onClick = {(e) =>{
                this.props.callDataDrawer( {docproxy:this.itemProxy,options:{opcode:'info'}}) }
            }
        >
            {false && <ActionButton 
                icon = 'lock' 
            />}
            <img className = {classes.databox} src = {databox} /> 
            <img className = {classes.avatar} src = {avatar} /> 
            <div className = { classes.namestyle } >
                {this.state.item && this.state.item.docpack.document.properties.name}
            </div>
            {!contextitem && <ActionButton 
                buttonStyle = {
                    {
                        float:'none',
                        width:'24px',
                        height:'24px',
                    }
                } 
                action = {e => (
                    e.stopPropagation()
                )}
                icon = 'crop_portrait' />}
            {!contextitem && <ActionButton 
                buttonStyle = {
                    {
                        float:'none',
                        width:'24px',
                        height:'24px',
                    }
                } 
                action = {e => (
                    e.stopPropagation()
                )}
                icon = 'expand_more' />}
            {(false && !contextitem) && <div 
                ref = {this.menuAnchor}
            >
                <ActionButton 
                    buttonStyle = {
                        {
                            float:'none',
                            width:'24px',
                            height:'24px',
                        }
                    } 
                    icon = 'more_vert' 
                    action = {this.toggleMenu}
                />
                {(!contextitem) && <PopupMenu
                    menuopen = {this.state.menuopen}
                    menuAnchor = {this.menuAnchor}
                    menuClose = {this.menuClose}
                >
                    <MenuItem className = {classes.menustyle}
                        onClick = {(e) =>{
                            this.props.callDataDrawer( {docproxy:this.itemProxy,options:{opcode:'info'}}) }
                        }>
                        <Info /> Info
                    </MenuItem>
                    <MenuItem className = {classes.menustyle}
                        onClick = {(e) =>{
                            this.callDataDrawer(e,'edit')}
                        }>
                        <Icon style = {{opacity:.54}} >edit</Icon> Edit
                    </MenuItem>
                    <MenuItem className = {classes.menustyle}
                        disabled
                        onClick = {(e) =>{
                            this.callDataDrawer(e,'remove')}
                        }>
                        <Icon style = {{opacity:.54}} >close</Icon> Remove
                    </MenuItem>
                    <MenuItem className = {classes.menustyle}
                        disabled
                        onClick = {(e) =>{
                            this.callDataDrawer(e,'delete')}
                        }>
                        <Icon style = {{opacity:.54}} >delete</Icon> Delete
                    </MenuItem>
                </PopupMenu>}
            </div>}
        </div>
    </div>
    }
}

export default withStyles(styles)(IdentityBar)
