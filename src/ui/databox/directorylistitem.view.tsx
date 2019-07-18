// directoryitem.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/*
    TODO: when variable size happens, must calculate and set the height of barstyle
        for react-window
*/

'use strict'

import React from 'react'

import Icon from '@material-ui/core/Icon'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { toast } from 'react-toastify'

import ActionButton from '../common/actionbutton.view'

import QuantityBadge from '../common/quantitybadge.view'
import LoadingMessage from '../common/loadingmessage.view'

import { SetListenerMessage, RemoveListenerMessage, ReturnDocPairMessage } from '../../services/interfaces'

const styles = createStyles({
    barstyle: {
        padding:'3px',
        boxSizing:'border-box',
        cursor:'pointer',
        position:'relative',
        borderBottom:'1px solid #e2e6e9',
        height:'31px', // has to be set for react-window?
    },

    rowstyle:{
        position:'relative',
        paddingRight:'3px',
        display:'flex',
        flexFlow:'row nowrap',
        alignItems:'center',
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
    progress: {
        // height:'25px',
    },
})

class DirectoryListItem extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.barelementref = React.createRef()
        if (props.highlight) {
            this.highlight = props.highlight
        }
    }

    state = {
        list:null,
    }

    listProxy

    barelementref
    highlight

    unmounting = false

    componentDidMount() {

        if ((!this.listProxy) && this.props.listProxy) {
            this.listProxy = this.props.listProxy
            let parms:SetListenerMessage = 
                {
                    doctoken:this.listProxy.doctoken,
                    instanceid:this.listProxy.instanceid,
                    success:this.cacheListDocument,
                    failure:this.failCacheListDocument,
                }
            this.props.setDocpackPairListener( parms )
        }

    }

    componentDidUpdate() {

        if (this.highlight && this.barelementref) {
            this.props.highlightItem(this.barelementref)
            this.highlight = false
        }
    }

    componentWillUnmount() {
        this.unmounting = true
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

    cacheListDocument = ({docpack, typepack, reason}:ReturnDocPairMessage) => {

        if (this.unmounting) return
        this.setState({
            list:{
                docpack,
                typepack,
            }
        })
    }

    failCacheListDocument = (error, reason) => {
        toast.error('error in directory list item:' + error)
        console.log('error in directory list item', error, reason)
    }


    expandDirectoryItem = () => {
        this.props.expandDirectoryItem(this.barelementref.current)
    }

    render() {

        let { classes } = this.props
        let listDocument = this.state.list?this.state.list.docpack.document:null
        let quantity = listDocument?(listDocument.counts.lists + listDocument.counts.links):0
        return <div 
            className = {
                classes.barstyle
            }
            onClick = {this.expandDirectoryItem}
            ref = {this.barelementref}
        >
            {listDocument
                ?<div 
                        className = {classes.rowstyle}
                    > 
                        {quantity?<ActionButton 
                            buttonStyle = {
                                {
                                    float:'none',
                                    width:'24px',
                                    height:'24px',
                                }
                            } 
                            icon = 'arrow_right' 
                            action = {(e)=>{
                                e.stopPropagation()
                            }}
                        />:<div style = {
                            {
                                display:'inline-block',
                                width:'24px',
                                height:'24px',
                            }
                        }></div>}
                        <Icon 
                            style = {
                                {
                                    color:listDocument?listDocument.system.attributes.sysnode?'green':'gray':'gray',
                                }
                            } 
                        >
                            folder
                        </Icon> 

                        {listDocument.properties.icon?<img className = {classes.iconstyle} src={listDocument.properties.icon as any} />:null}

                        <div className = {classes.namestyle}>
                            <span>{listDocument.properties.name}</span>  <span 
                                className = {classes.countstyle}>{listDocument.counts.lists + 
                                    listDocument.counts.links}</span>
                        </div>

                    </div>

                :<div className = {classes.progress}> 
                    <LoadingMessage />
                </div>
            }
        </div>
    }
}

export default withStyles(styles)(DirectoryListItem)
