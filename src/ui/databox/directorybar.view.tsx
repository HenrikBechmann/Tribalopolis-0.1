
// directorybar.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/*
    TODO: isolate popup menu to common component
*/

'use strict'

import React from 'react'

import Icon from '@material-ui/core/Icon'
import CircularProgress from '@material-ui/core/CircularProgress'
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider'
import PopupMenu from '../common/popupmenu.view'
import Info from '@material-ui/icons/InfoOutlined'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { toast } from 'react-toastify'

import QuantityBadge from '../common/quantitybadge.view'
import ActionButton from '../common/actionbutton.view'
import LoadingMessage from '../common/loadingmessage.view'

import { SetListenerMessage, RemoveListenerMessage, DocpackPairPayloadMessage } from '../../services/interfaces'

const styles = createStyles({ 
    barstyle:{
        boxSizing:'border-box',
        position:'relative',
        borderBottom:'1px solid #e2e6e9',

        borderRadius:'8px',
        backgroundColor:'#f2f2f2',
        padding:'3px',
    },

    rowstyle:{
        position:'relative',
        display:'flex',
        flexFlow:'row nowrap',
        alignItems:'center',
        cursor:'pointer',
    },
    namestyle:{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        paddingLeft:'3px',
        whiteSpace:'nowrap',
        flex:1,
    },
    iconstyle: {
        width:'16px',
    },
    countstyle:{
        fontSize:'smaller',
        color:'silver',
    },
    arrowstyle:{
        float:'right',
        width:'32px',
        height:'32px', 
        position:'relative',
    },
    progress:{
        // height:'33px',
    },
    menustyle:{
        padding:'6px',
        fontSize:'.86rem',
    }
})

class DirectoryBar extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.menuAnchor = React.createRef()
    }

    state = {
        list:null,
        menuopen:false,
    }

    listProxy
    menuAnchor
    isunmounting

    componentDidMount() {
        this.assertList()
    }

    componentDidUpdate() {
        this.assertList()
    } 

    assertList = () => {
        if (!this.listProxy && this.props.listProxy) {
            this.listProxy = this.props.listProxy
            let parms: SetListenerMessage = 
                {
                    doctoken:this.listProxy.doctoken,
                    instanceid:this.listProxy.instanceid,
                    success:this.cacheListDocument,
                    failure:this.failCacheListDocument,
                }
            this.props.setDocpackPairListener( parms )
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
            this.props.removeDocpackPairListener( parms )
        }        
    }

    cacheListDocument = ({docpack,typepack, reason}:DocpackPairPayloadMessage) => {
        if (this.isunmounting) return

        this.setState({
            list:{
                docpack,
                typepack,
            }
        })
    }

    failCacheListDocument = (error, reason) => {
        toast.error('error in DirectoryBar: ' + error)
        console.log('error in DirectoryBar', error, reason)
    }

    toggleMenu = (e) => {
        this.setState(state => ({ menuopen: !state.menuopen }));
        e.stopPropagation()
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
        this.props.callDataDrawer({docproxy:this.listProxy,options:opcode})
    }

    render() {

        let { listStack, classes, haspeers, contextitem } = this.props
        let listDocument = this.state.list?this.state.list.docpack.document:null

        return <div 
                className = {classes.barstyle}
            >
                {listDocument
                ?(<div className = {classes.rowstyle}
                    onClick = {(e) =>{
                        this.props.callDataDrawer( e, 'info' ) }
                    }
                  >
                    <Icon >folder</Icon> 
                    {listDocument.properties.icon?<img className = {classes.iconstyle} src={listDocument.properties.icon as any} />:null}
                    <div className = {classes.namestyle} >
                        <span>{ listDocument.properties.name } </span>
                        <span 
                            className = {
                                classes.countstyle
                            }
                        >
                            {listDocument.counts.lists + listDocument.counts.links}
                        </span>
                    </div>
                    {!contextitem && <ActionButton 
                        disabled
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
                        icon = 'format_indent_decrease' />}
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
                        icon = 'format_indent_increase' />}
                    {false && !contextitem && <ActionButton 
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
                    {(!contextitem) && <div 
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
                    </div>}
                    {(!contextitem) && <PopupMenu
                        menuopen = {this.state.menuopen}
                        menuAnchor = {this.menuAnchor}
                        menuClose = {this.menuClose}
                    >
                        <MenuItem className = {classes.menustyle}
                            onClick = {(e) =>{
                                this.callDataDrawer(e,'info')}
                            }>
                            <Info style = {{opacity:.54}} /> Info
                        </MenuItem>
                        <MenuItem className = {classes.menustyle}
                            onClick = {(e) =>{
                                this.callDataDrawer(e,'filter')}
                            }>
                            <Icon style = {{opacity:.54}} >filter_list</Icon> Filter
                        </MenuItem>
                        <Divider />
                        <MenuItem className = {classes.menustyle}
                            onClick = {(e) =>{
                                this.callDataDrawer(e,'edit')}
                            }>
                            <Icon style = {{opacity:.54}} >edit</Icon> Edit
                        </MenuItem>
                        {false && <MenuItem className = {classes.menustyle}
                            disabled
                            onClick = {(e) =>{
                                this.callDataDrawer(e,'remove')}
                            }>
                            <Icon style = {{opacity:.54}} >close</Icon> Remove
                        </MenuItem>}
                        {false && <MenuItem className = {classes.menustyle}
                            disabled
                            onClick = {(e) =>{
                                this.callDataDrawer(e,'delete')}
                            }>
                            <Icon style = {{opacity:.54}} >delete</Icon> Delete
                        </MenuItem>}
                        <Divider />
                        {false && <MenuItem className = {classes.menustyle}
                            onClick = {this.menuClose}>
                            <div style = {{display:'inline-block',width:'24px', height:'24px'}}></div>
                            {false && <Icon style = {{opacity:.54}} >check</Icon>} Select Mode
                        </MenuItem>}
                        <MenuItem className = {classes.menustyle}
                            onClick = {(e) =>{
                                this.callDataDrawer(e,'add-label')}
                            }>
                            <Icon style = {{opacity:.54}} >label</Icon> New Label
                        </MenuItem>
                        {false && <MenuItem className = {classes.menustyle}
                            onClick = {this.menuClose}>
                            <Icon style = {{opacity:.54}} >check</Icon> Show All Records
                        </MenuItem>}
                        <MenuItem className = {classes.menustyle}
                            onClick = {this.menuClose}>
                            <Icon style = {{opacity:.54}}>label_off</Icon> Hide Labels
                        </MenuItem>
                        <Divider />
                        <MenuItem className = {classes.menustyle}
                            onClick={this.menuClose}>
                            <div 
                                style = {
                                    {
                                        display:'inline-block',
                                        marginRight:'6px',
                                    }
                                }>Layout</div>
                            <ActionButton 
                                icon = 'view_headline'
                                iconStyle = {{border:'1px solid gray',borderRadius:'50%'}}
                            />
                            <ActionButton 
                                iconStyle = {{width:'16px'}} 
                                img = '/public/icons/cards.svg'
                            />
                            <ActionButton 
                                iconStyle = {{width:'16px'}} 
                                img = '/public/icons/variablecards.svg'
                            />
                            <ActionButton 
                                iconStyle = {{width:'16px'}} 
                                icon = 'grid_on'
                            />
                        </MenuItem>
                    </PopupMenu>}
                    {false && contextitem && <ActionButton // not needed
                        buttonStyle = {
                            {
                                float:'none',
                                width:'24px',
                                height:'24px',
                                marginLeft:'6px',
                            }
                        } 
                        action = {
                            () => {this.props.callDataDrawer({docproxy:this.listProxy,opcode:'info'})}
                        }
                        component = {<Info />}
                    />}

                </div>)

                :<div className = {classes.progress}>
                    <LoadingMessage />
                </div>}
            </div>
            
    }
}

export default withStyles(styles)(DirectoryBar)