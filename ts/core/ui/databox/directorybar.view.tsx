// directorybar.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

/*
    TODO: tabs no longer used, currently hidden. purge them
*/
'use strict'

import React from 'react'

import Icon from '@material-ui/core/Icon'
import CircularProgress from '@material-ui/core/CircularProgress'

import QuantityBadge from '../common/quantitybadge.view'
import ActionButton from '../common/actionbutton.view'
import InfoOutlined from '@material-ui/icons/InfoOutlined'
import { withStyles, createStyles } from '@material-ui/core/styles'

const styles = createStyles({ 
    barstyle:{
        width:'100%',
        borderRadius:'8px 8px 0 0',
        paddingTop:'3px',
        whiteSpace:'nowrap',
        overflow:'hidden',
        boxSizing:'border-box',
        marginBottom: '1px',
        top:'0',
        backgroundColor:'#f2f2f2',
        zIndex:1,
    },

    tabwrapperstyle:{
        borderBottom:'1px solid silver',
        position:'relative',
        height:'32px',
    },

    pretabstyle:{
        display:'inline-block',
        height:'32px',
        width:'5px',
        verticalAlign:'middle',
    },

    tabstyle:{
        display:'inline-block',
        position:'relative',
        verticalAlign:'middle',
        borderWidth:'1px',
        borderRadius:'6px 6px 0 0',
        borderColor:'transparent',
        borderStyle:'solid',
        paddingRight:'3px',
        marginLeft:'-1px',
        marginBottom:'-7px',
        // backgroundColor:'white',
        maxWidth:'calc(100% - 80px)',
        // cursor:'pointer',
    },
    namestyle:{
        display:'inline-block',
        verticalAlign:'middle',                        
        textOverflow: 'ellipsis',
        maxWidth: '90%',
        overflow: 'hidden',
    },
    arrowstyle:{
        float:'right',
        width:'32px',
        height:'32px', 
        position:'relative',
    },
    progress:{
        height:'33px',
    }
})

class DirectoryBar extends React.Component<any,any> {

    state = {
        list:null
    }

    listProxy

    componentDidUpdate() {
        if (!this.listProxy && this.props.listProxy) {
            this.listProxy = this.props.listProxy
            this.props.setListListener(
                this.listProxy.token,this.listProxy.instanceid,this.cacheListDocument)
        }        
    } 

    componentWillUnmount() {
        if (this.listProxy) {
            this.props.removeListListener(
                this.listProxy.token,this.listProxy.instanceid)
        }        
    }

    cacheListDocument = (document,type) => {
        this.setState({
            list:{
                document,
                type
            }
        })
    }

    render() {

        let { listStack, classes } = this.props
        let listDocument = this.state.list?this.state.list.document:null

        return <div>
            <div 
                className = {classes.barstyle}
            >
                {listDocument
                ?(<div className = {classes.tabwrapperstyle}>

                    <ActionButton icon = 'more_vert' />
                    { listStack.length
                        ?<div className = {classes.arrowstyle}>

                            <QuantityBadge 
                                quantity = {listStack.length} 
                                style = {{left:'-6px',top:'-6px'}}
                            />
                            <ActionButton 
                                icon = 'arrow_back'
                                action = {this.props.collapseDirectoryItem}
                            />

                        </div>

                        :null
                    }
                    <div className = {classes.pretabstyle}></div>
                    <div className = {classes.tabstyle} > 

                        <Icon style = {{verticalAlign:'middle'}}>folder_open</Icon> 
                        <QuantityBadge 
                            quantity = {listDocument.counts.lists + listDocument.counts.links} 
                            style = {{left:'-6px',top:'-8px'}}
                        />
                        <div className = {classes.namestyle} >
                            {listDocument.properties.name}
                        </div>

                    </div>

                </div>)

                :<div className = {classes.progress}>

                    <CircularProgress size = {12} />

                </div>}
            </div>
            
        </div>
    }
}

export default withStyles(styles)(DirectoryBar)